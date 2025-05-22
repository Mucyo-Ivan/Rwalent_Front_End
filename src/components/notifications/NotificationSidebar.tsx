import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, CheckCircle, XCircle, Mail, Info, MessageCircle } from 'lucide-react';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'BOOKING_ACCEPTED':
      return <CheckCircle className="h-6 w-6 text-green-500 bg-green-100 rounded-full p-1" />;
    case 'BOOKING_REJECTED':
      return <XCircle className="h-6 w-6 text-red-500 bg-red-100 rounded-full p-1" />;
    case 'NEW_MESSAGE':
      return <Mail className="h-6 w-6 text-blue-500 bg-blue-100 rounded-full p-1" />;
    default:
      return <Info className="h-6 w-6 text-gray-500 bg-gray-100 rounded-full p-1" />;
  }
};

export const NotificationSidebar: React.FC = () => {
  const { notifications, markAsRead, clearAll, refresh, loadMore, hasMore, loading } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastNotificationRef = useRef<HTMLDivElement>(null);

  // Sort: unread first, then by date
  const sorted = [...notifications].sort((a, b) => {
    if (a.isRead === b.isRead) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.isRead ? 1 : -1;
  });

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (lastNotificationRef.current) {
      observerRef.current.observe(lastNotificationRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [notifications, hasMore, loading, loadMore]);

  // Responsive: show/hide sidebar on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      {isMobile && !mobileOpen && (
        <button
          className="fixed top-20 left-2 z-40 bg-white border shadow px-3 py-2 rounded-full"
          onClick={() => setMobileOpen(true)}
        >
          Notifications
        </button>
      )}
      
      <aside
        className={`bg-white border-r h-full overflow-y-auto p-4 shadow-md transition-all duration-300
          ${isMobile ? `fixed top-0 left-0 z-50 w-4/5 max-w-xs h-full ${mobileOpen ? '' : 'translate-x-[-110%]'}` : 'w-full max-w-xs sticky top-0'}`}
      >
        {isMobile && (
          <button className="absolute top-4 right-4 text-gray-500" onClick={() => setMobileOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        )}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Notifications</h2>
          {notifications.length > 0 && (
            <button onClick={async () => { await clearAll(); refresh(); }} className="text-xs text-red-500 hover:underline">Clear all</button>
          )}
        </div>
        
        <ul className="space-y-2">
          {sorted.length === 0 && <li className="text-gray-500">No notifications</li>}
          {sorted.map((n, index) => (
            <li
              key={n.id}
              ref={index === sorted.length - 1 ? lastNotificationRef : null}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition hover:bg-gray-100 ${!n.isRead ? 'bg-red-50' : ''} ${location.pathname.endsWith(`/${n.id}`) ? 'ring-2 ring-rwanda-green' : ''}`}
              onClick={async () => {
                if (!n.isRead) await markAsRead(n.id);
                refresh();
                navigate(`${location.pathname.startsWith('/talent') ? '/talent/notifications' : '/notifications'}/${n.id}`);
                if (isMobile) setMobileOpen(false);
              }}
            >
              {/* Icon */}
              <span className="mr-3 flex-shrink-0">{getNotificationIcon(n.notificationType)}</span>
              {!n.isRead && <span className="h-2 w-2 bg-red-500 rounded-full mr-2" />}
              <span className={`flex-1 ${!n.isRead ? 'font-semibold text-black' : 'text-gray-700'}`}>{n.message}</span>
              <span className="ml-2 text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
          {loading && <li className="text-center text-gray-500 py-2">Loading...</li>}
          {!hasMore && notifications.length > 0 && <li className="text-center text-gray-500 py-2">No more notifications</li>}
        </ul>
      </aside>
    </>
  );
};

export default NotificationSidebar; 