import React, { useRef, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Mail, 
  Info, 
  Trash2, 
  Check,
  X,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'BOOKING_ACCEPTED':
      return <CheckCircle className="h-5 w-5 text-green-500 bg-green-100 rounded-full p-0.5" />;
    case 'BOOKING_REJECTED':
      return <XCircle className="h-5 w-5 text-red-500 bg-red-100 rounded-full p-0.5" />;
    case 'NEW_MESSAGE':
      return <Mail className="h-5 w-5 text-blue-500 bg-blue-100 rounded-full p-0.5" />;
    default:
      return <Info className="h-5 w-5 text-gray-500 bg-gray-100 rounded-full p-0.5" />;
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

export const EnhancedNotificationSidebar: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    clearNotification, 
    clearAll, 
    refresh, 
    loadMore, 
    hasMore, 
    loading 
  } = useNotifications();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastNotificationRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  // Sort: unread first, then by date
  const sortedNotifications = [...notifications]
    .sort((a, b) => {
      if (a.isRead === b.isRead) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.isRead ? 1 : -1;
    })
    .filter(n => filter === 'all' || !n.isRead);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (lastNotificationRef.current && sortedNotifications.length > 0) {
      observerRef.current.observe(lastNotificationRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sortedNotifications, hasMore, loading, loadMore]);

  const handleNotificationClick = async (id: number, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(id);
      refresh();
    }
    
    // Navigate based on user type
    const basePath = userProfile?.userType === 'TALENT' ? '/talent/notifications/' : '/notifications/';
    navigate(`${basePath}${id}`);
  };

  const handleMarkAllAsRead = async () => {
    // We'll mark all currently loaded notifications as read
    for (const notification of notifications.filter(n => !n.isRead)) {
      await markAsRead(notification.id);
    }
    refresh();
  };

  const currentId = location.pathname.split('/').pop();

  return (
    <div className="w-full h-full flex flex-col bg-white border-r shadow-sm">
      {/* Header */}
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              title="Mark all as read"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              title="Clear all notifications"
              onClick={() => clearAll().then(refresh)}
              disabled={notifications.length === 0}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Unread {unreadCount > 0 && <Badge className="ml-2 bg-red-500">{unreadCount}</Badge>}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {loading && notifications.length === 0 && (
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rwanda-green"></div>
          </div>
        )}
        
        {!loading && sortedNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Info className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 mb-2">
              {filter === 'all' ? 'No notifications yet' : 'No unread notifications'}
            </p>
            {filter === 'unread' && (
              <Button variant="outline" size="sm" onClick={() => setFilter('all')}>
                View all notifications
              </Button>
            )}
          </div>
        )}
        
        <div className="divide-y">
          {sortedNotifications.map((notification, index) => (
            <div
              key={notification.id}
              ref={index === sortedNotifications.length - 1 ? lastNotificationRef : null}
              className={`
                p-4 hover:bg-gray-50 cursor-pointer transition
                ${notification.id.toString() === currentId ? 'bg-gray-100' : ''}
                ${!notification.isRead ? 'border-l-4 border-rwanda-green pl-3' : ''}
              `}
              onClick={() => handleNotificationClick(notification.id, notification.isRead)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getNotificationIcon(notification.notificationType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className={`text-sm mb-1 ${!notification.isRead ? 'font-semibold' : ''}`}>{notification.message}</p>
                    <div className="flex items-center ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notification.id).then(refresh);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{formatTimeAgo(notification.createdAt)}</span>
                    {!notification.isRead && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">New</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {loading && notifications.length > 0 && (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-rwanda-green"></div>
            </div>
          )}
          
          {!hasMore && notifications.length > 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              No more notifications
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedNotificationSidebar;
