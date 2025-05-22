import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { notifications as api, UserNotification, NotificationPage } from '@/lib/api';
import { toast } from 'sonner';

interface NotificationContextType {
  notifications: UserNotification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: number) => Promise<void>;
  clearNotification: (id: number) => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async (pageNum = 0) => {
    setLoading(true);
    try {
      const data = await api.getUserNotifications(pageNum);
      if (pageNum === 0) {
        setNotifications(data.content);
      } else {
        setNotifications(prev => [...prev, ...data.content]);
      }
      setHasMore(!data.last);
      setPage(pageNum);
      
      // Update unread count based on notifications
      const unread = data.content.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await api.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      // Don't show error toast for unread count
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    
    // Refresh notifications every minute
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await api.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  };

  const clearNotification = async (id: number) => {
    try {
      await api.clearNotification(id);
      const deletedNotification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to clear notification:', error);
      throw error;
    }
  };

  const clearAll = async () => {
    try {
      await api.clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
      throw error;
    }
  };

  const loadMore = async () => {
    if (!loading && hasMore) {
      await fetchNotifications(page + 1);
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        loading, 
        markAsRead, 
        clearNotification, 
        clearAll, 
        refresh: () => fetchNotifications(0),
        loadMore,
        hasMore
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider');
  return ctx;
}; 