import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import { Trash2, CheckCircle, XCircle, Mail, Info } from 'lucide-react';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'BOOKING_ACCEPTED':
      return <CheckCircle className="h-10 w-10 text-green-500 bg-green-100 rounded-full p-2 mb-2" />;
    case 'BOOKING_REJECTED':
      return <XCircle className="h-10 w-10 text-red-500 bg-red-100 rounded-full p-2 mb-2" />;
    case 'NEW_MESSAGE':
      return <Mail className="h-10 w-10 text-blue-500 bg-blue-100 rounded-full p-2 mb-2" />;
    default:
      return <Info className="h-10 w-10 text-gray-500 bg-gray-100 rounded-full p-2 mb-2" />;
  }
};

const NotificationDetailPage: React.FC = () => {
  const { id } = useParams();
  const { notifications, markAsRead, clearNotification, refresh } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const notification = notifications.find(n => n.id === Number(id));

  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notification.id).then(refresh);
    }
  }, [notification, markAsRead, refresh]);

  if (!notification) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2">Notification Not Found</h2>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-rwanda-green text-white rounded">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100 relative flex flex-col items-center">
        <button
          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
          title="Clear notification"
          onClick={async () => {
            await clearNotification(notification.id);
            refresh();
            navigate(location.pathname.startsWith('/talent') ? '/talent/notifications' : '/notifications');
          }}
        >
          <Trash2 className="h-5 w-5" />
        </button>
        {/* Icon */}
        {getNotificationIcon(notification.notificationType)}
        <h2 className="text-2xl font-bold mb-2">Notification</h2>
        <div className="mb-2">
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${notification.isRead ? 'bg-gray-200 text-gray-600' : 'bg-red-100 text-red-700'}`}>
            {notification.isRead ? 'Read' : 'Unread'}
          </span>
        </div>
        <p className="text-gray-700 mb-4 text-lg text-center">{notification.message}</p>
        <div className="text-xs text-gray-400 mb-2">{new Date(notification.createdAt).toLocaleString()}</div>
        {notification.relatedBookingId && (
          <div className="mb-2">
            <span className="font-semibold">Related Booking ID:</span> {notification.relatedBookingId}
          </div>
        )}
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-rwanda-green text-white rounded">Back to Notifications</button>
      </div>
    </div>
  );
};
export default NotificationDetailPage; 