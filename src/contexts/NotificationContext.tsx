import React, { createContext, useContext, useEffect, useReducer, ReactNode, useRef, useCallback } from 'react';
import { notifications as api, UserNotification } from '@/lib/api';
import { toast } from 'sonner';

// Define the notification state interface
interface NotificationState {
  cache: Record<number, UserNotification>; // Use object instead of array for O(1) lookups
  displayOrder: number[]; // Keep order separate from data
  unreadCount: number;
  loading: boolean;
  error: string | null;
  lastFetched: number;
  processingIds: Set<number>; // Track notifications being processed to prevent duplicate API calls
  hasMore: boolean;
  currentPage: number;
}

// Define the context interface
interface NotificationContextType {
  notifications: UserNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: number) => Promise<void>;
  clearNotification: (id: number) => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

// Define action types for the reducer
type NotificationAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { notifications: UserNotification[]; reset: boolean; hasMore: boolean } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_UNREAD_COUNT'; payload: number }
  | { type: 'MARK_AS_READ_START'; payload: number }
  | { type: 'MARK_AS_READ_SUCCESS'; payload: number }
  | { type: 'MARK_AS_READ_ERROR'; payload: number }
  | { type: 'REMOVE_NOTIFICATION'; payload: number }
  | { type: 'CLEAR_ALL' };

// Create the context with a default undefined value
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Initial state for the reducer
const initialState: NotificationState = {
  cache: {},
  displayOrder: [],
  unreadCount: 0,
  loading: false,
  error: null,
  lastFetched: 0,
  processingIds: new Set<number>(), // Track notifications being processed to prevent duplicate API calls
  hasMore: true,
  currentPage: 0,
};

// Reducer function for managing notification state
function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'FETCH_SUCCESS': {
      const { notifications, reset, hasMore } = action.payload;
      let newCache = { ...state.cache };
      let newOrder: number[] = [];

      if (reset) {
        // For a reset, we create a new cache and order
        newCache = {};
        notifications.forEach(notification => {
          newCache[notification.id] = notification;
          newOrder.push(notification.id);
        });
      } else {
        // For pagination, we merge with existing cache
        notifications.forEach(notification => {
          // Only add if not already in cache
          if (!newCache[notification.id]) {
            newCache[notification.id] = notification;
            newOrder.push(notification.id);
          }
        });
        // Merge with existing display order
        newOrder = [...state.displayOrder, ...newOrder];
      }

      return {
        ...state,
        cache: newCache,
        displayOrder: newOrder,
        loading: false,
        error: null,
        lastFetched: Date.now(),
        hasMore,
        currentPage: reset ? 0 : state.currentPage + 1,
      };
    }

    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'SET_UNREAD_COUNT':
      return {
        ...state,
        unreadCount: action.payload,
      };

    case 'MARK_AS_READ_START': {
      const id = action.payload;
      const notification = state.cache[id];
      
      if (!notification || state.processingIds.has(id)) return state;

      // Add to processing set to prevent duplicate calls
      const newProcessingIds = new Set(state.processingIds);
      newProcessingIds.add(id);

      // Optimistically mark as read
      const newUnreadCount = notification.isRead ? 
        state.unreadCount : 
        Math.max(0, state.unreadCount - 1);

      return {
        ...state,
        cache: {
          ...state.cache,
          [id]: { ...notification, isRead: true },
        },
        unreadCount: newUnreadCount,
        processingIds: newProcessingIds
      };
    }

    case 'MARK_AS_READ_SUCCESS': {
      const id = action.payload;
      
      // Remove from processing set
      const newProcessingIds = new Set(state.processingIds);
      newProcessingIds.delete(id);

      return {
        ...state,
        processingIds: newProcessingIds
      };
    }

    case 'MARK_AS_READ_ERROR': {
      const id = action.payload;
      
      // Remove from processing set
      const newProcessingIds = new Set(state.processingIds);
      newProcessingIds.delete(id);
      
      return {
        ...state,
        processingIds: newProcessingIds
      };
    }

    case 'REMOVE_NOTIFICATION': {
      const id = action.payload;
      const notification = state.cache[id];
      
      if (!notification) return state;

      const newCache = { ...state.cache };
      delete newCache[id];

      const newUnreadCount = notification.isRead ? 
        state.unreadCount : 
        Math.max(0, state.unreadCount - 1);

      return {
        ...state,
        cache: newCache,
        displayOrder: state.displayOrder.filter(notifId => notifId !== id),
        unreadCount: newUnreadCount,
      };
    }

    case 'CLEAR_ALL':
      return {
        ...initialState,
        lastFetched: Date.now(),
      };

    default:
      return state;
  }
}

// Prevent multiple simultaneous API calls
function useApiLock() {
  const lockRef = useRef(false);
  
  const acquire = () => {
    if (lockRef.current) return false;
    lockRef.current = true;
    return true;
  };
  
  const release = () => {
    lockRef.current = false;
  };
  
  return { acquire, release, isLocked: () => lockRef.current };
}

// Helper for retry logic with exponential backoff
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise(res => setTimeout(res, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const fetchLock = useApiLock();
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Convert cache to sorted array for consumers
  const notifications = state.displayOrder
    .map(id => state.cache[id])
    .filter(Boolean);

  // Fetch notifications with pagination support
  const fetchNotifications = useCallback(async (pageNum = 0, forceRefresh = false) => {
    if (!token) {
      dispatch({ type: 'FETCH_ERROR', payload: 'Not authenticated. Please sign in.' });
      return;
    }
    // Skip if already fetching or if fetched recently (unless forced)
    if (!forceRefresh) {
      const timeSinceLastFetch = Date.now() - state.lastFetched;
      if (timeSinceLastFetch < 2000 || !fetchLock.acquire()) {
        return;
      }
    } else if (!fetchLock.acquire()) {
      return;
    }
    
    const isReset = pageNum === 0;
    
    if (isReset) {
      dispatch({ type: 'FETCH_START' });
    }
    
    try {
      const data = await retryWithBackoff(() => api.getUserNotifications(pageNum));
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          notifications: data.content,
          reset: isReset,
          hasMore: !data.last,
        },
      });
      
      // Update unread count from backend for accuracy
      if (isReset) {
        await fetchUnreadCount();
      }
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
      dispatch({
        type: 'FETCH_ERROR',
        payload: error.message || 'Failed to load notifications',
      });
      
      if (isReset) {
        toast.error('Could not load notifications');
      }
    } finally {
      fetchLock.release();
    }
  }, [state.lastFetched, token]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await retryWithBackoff(() => api.getUnreadCount());
      dispatch({ type: 'SET_UNREAD_COUNT', payload: count });
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // Set up initial fetch and refresh interval
  useEffect(() => {
    // Initial load
    fetchNotifications(0, true);
    
    // Set up refresh interval - fetch every 15 seconds
    const interval = setInterval(() => {
      fetchNotifications(0, true);
    }, 15000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (id: number) => {
    // Check if notification exists and is not already being processed
    const notification = state.cache[id];
    if (!notification || state.processingIds.has(id)) {
      return; // Skip if already processing or doesn't exist
    }
    
    // If already read, don't make an API call
    if (notification.isRead) {
      return;
    }

    // Start processing - optimistic update
    dispatch({ type: 'MARK_AS_READ_START', payload: id });
    
    try {
      // Make API call - only once, with retry
      await retryWithBackoff(() => api.markAsRead(id));
      dispatch({ type: 'MARK_AS_READ_SUCCESS', payload: id });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      dispatch({ type: 'MARK_AS_READ_ERROR', payload: id });
      // Only refresh on actual error
      fetchNotifications(0, true);
      throw error;
    }
  }, [fetchNotifications]);

  // Clear a notification
  const clearNotification = useCallback(async (id: number) => {
    // Optimistic update
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    
    try {
      // Make API call with retry
      await retryWithBackoff(() => api.clearNotification(id));
    } catch (error) {
      console.error('Failed to clear notification:', error);
      // Refresh on error to reset state
      fetchNotifications(0, true);
      throw error;
    }
  }, [fetchNotifications]);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    // Optimistic update
    dispatch({ type: 'CLEAR_ALL' });
    
    try {
      // Make API call with retry
      await retryWithBackoff(() => api.clearAllNotifications());
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
      // Refresh on error to reset state
      fetchNotifications(0, true);
      throw error;
    }
  }, [fetchNotifications]);

  // Load more notifications for pagination
  const loadMore = useCallback(async () => {
    if (state.hasMore && !state.loading && !fetchLock.isLocked()) {
      await retryWithBackoff(() => fetchNotifications(state.currentPage + 1));
    }
  }, [fetchNotifications, state.hasMore, state.loading, state.currentPage]);

  // Create a stable context value reference
  const contextValue = React.useMemo(() => ({
    notifications,
    unreadCount: state.unreadCount,
    loading: state.loading,
    error: state.error,
    markAsRead,
    clearNotification,
    clearAll,
    refresh: () => fetchNotifications(0, true),
    loadMore,
    hasMore: state.hasMore,
  }), [
    notifications,
    state.unreadCount,
    state.loading,
    state.error,
    state.hasMore,
    markAsRead,
    clearNotification,
    clearAll,
    fetchNotifications,
    loadMore,
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider');
  return ctx;
};