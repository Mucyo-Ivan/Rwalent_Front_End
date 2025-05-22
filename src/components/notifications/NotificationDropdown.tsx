import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Info, 
  Settings, 
  Check, 
  Trash2 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'BOOKING_ACCEPTED':
      return <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />;
    case 'BOOKING_REJECTED':
      return <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />;
    case 'NEW_MESSAGE':
      return <Mail className="h-5 w-5 text-blue-500 flex-shrink-0" />;
    default:
      return <Info className="h-5 w-5 text-gray-500 flex-shrink-0" />;
  }
};

const NotificationDropdown: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    clearNotification, 
    clearAll, 
    refresh,
    loading
  } = useNotifications();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Keep notification state updated
  useEffect(() => {
    // Initial fetch
    refresh();
    
    // Set up interval to check for new notifications
    const interval = setInterval(() => {
      refresh();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Filter to most recent 5 notifications for the dropdown
  const recentNotifications = [...notifications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 7);

  const handleNotificationClick = async (id: number, isRead: boolean) => {
    if (!isRead) {
      try {
        await markAsRead(id);
        await refresh();
        // Display success toast
        toast("Notification marked as read");
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
        toast("Failed to mark notification as read");
      }
    }
    
    // Navigate to the appropriate notification detail page
    const basePath = userProfile?.userType === 'TALENT' ? '/talent/notifications/' : '/notifications/';
    navigate(`${basePath}${id}`);
    setOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all displayed notifications as read
      const unreadNotifications = recentNotifications.filter(n => !n.isRead);
      
      if (unreadNotifications.length === 0) {
        toast("No unread notifications");
        return;
      }
      
      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }
      await refresh();
      
      // Show success message
      toast(`${unreadNotifications.length} notification${unreadNotifications.length > 1 ? 's' : ''} marked as read`);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast("Failed to mark notifications as read");
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative rounded-full p-1 hover:bg-gray-100 focus:outline-none">
          <Bell className="h-6 w-6 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] p-0 mr-4 max-h-[80vh] flex flex-col shadow-lg"
        align="end"
        sideOffset={5}
      >
        <div className="flex items-center justify-between bg-gray-50 p-4 border-b sticky top-0 z-10">
          <h3 className="font-semibold text-lg">Notifications</h3>
          <div className="flex gap-2">
            <button 
              onClick={handleMarkAllAsRead}
              className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-200"
              title="Mark all as read"
            >
              <Check className="h-5 w-5" />
            </button>
            <button 
              onClick={async () => { await clearAll(); refresh(); }}
              className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-200"
              title="Clear all notifications"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button 
              onClick={() => navigate(userProfile?.userType === 'TALENT' ? '/talent/notifications' : '/notifications')}
              className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-200"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto" ref={scrollRef}>
          {loading && (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rwanda-green"></div>
            </div>
          )}
          
          {!loading && recentNotifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <Bell className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          )}
          
          {recentNotifications.map((notification, index) => (
            <div key={notification.id}>
              <div 
                className={`p-4 hover:bg-gray-100 cursor-pointer flex gap-3 transition-colors ${!notification.isRead ? 'bg-gray-50' : ''}`}
                onClick={() => handleNotificationClick(notification.id, notification.isRead)}
              >
                <div className="mt-0.5">
                  {getNotificationIcon(notification.notificationType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-sm ${!notification.isRead ? 'font-semibold' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                      )}
                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id).then(refresh);
                              toast("Marked as read");
                            }}
                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-gray-200"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notification.id).then(refresh);
                            toast("Notification removed");
                          }}
                          className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
                          title="Remove notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>
              </div>
              {index < recentNotifications.length - 1 && <Separator />}
            </div>
          ))}
        </div>
        
        <div className="p-3 border-t mt-auto">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => {
              navigate(userProfile?.userType === 'TALENT' ? '/talent/notifications' : '/notifications');
              setOpen(false);
            }}
          >
            View All Notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
