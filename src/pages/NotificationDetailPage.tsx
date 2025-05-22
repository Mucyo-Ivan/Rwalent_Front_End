import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import { Trash2, CheckCircle, XCircle, Mail, Info, ArrowLeft, Calendar, MapPin, Clock, DollarSign, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'BOOKING_ACCEPTED':
      return <CheckCircle className="h-12 w-12 text-green-500 p-2" />;
    case 'BOOKING_REJECTED':
      return <XCircle className="h-12 w-12 text-red-500 p-2" />;
    case 'NEW_MESSAGE':
      return <Mail className="h-12 w-12 text-blue-500 p-2" />;
    default:
      return <Info className="h-12 w-12 text-gray-500 p-2" />;
  };
};

const getNotificationBgColor = (type: string) => {
  switch (type) {
    case 'BOOKING_ACCEPTED':
      return 'bg-green-50';
    case 'BOOKING_REJECTED':
      return 'bg-red-50';
    case 'NEW_MESSAGE':
      return 'bg-blue-50';
    default:
      return 'bg-gray-50';
  };
};

const getNotificationTitle = (type: string) => {
  switch (type) {
    case 'BOOKING_ACCEPTED':
      return 'Booking Accepted';
    case 'BOOKING_REJECTED':
      return 'Booking Rejected';
    case 'NEW_MESSAGE':
      return 'New Message';
    default:
      return 'Notification';
  };
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!notification) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle>Notification Not Found</CardTitle>
            <CardDescription>The notification you're looking for doesn't exist or has been deleted.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => navigate(-1)} 
              className="w-full bg-rwanda-green hover:bg-rwanda-green/90"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notifications
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="text-gray-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      
      <Card className="w-full shadow-md overflow-hidden">
        <div className={`p-6 ${getNotificationBgColor(notification.notificationType)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white p-2 shadow-sm">
                {getNotificationIcon(notification.notificationType)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{getNotificationTitle(notification.notificationType)}</h2>
                <p className="text-sm text-gray-600">{formatDate(notification.createdAt)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-red-500"
              title="Delete notification"
              onClick={async () => {
                await clearNotification(notification.id);
                refresh();
                navigate(location.pathname.startsWith('/talent') ? '/talent/notifications' : '/notifications');
              }}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="mb-4">
            <Badge variant={notification.isRead ? "outline" : "default"} className={notification.isRead ? "bg-gray-100" : "bg-rwanda-green"}>
              {notification.isRead ? 'Read' : 'New'}
            </Badge>
          </div>
          
          <p className="text-lg mb-6">{notification.message}</p>
          
          <Separator className="my-6" />
          
          {notification.relatedBookingId && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Booking Details</h3>
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Booking ID: {notification.relatedBookingId}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 text-rwanda-green border-rwanda-green hover:bg-rwanda-green/10"
                  onClick={() => {
                    // Navigate to booking details page if available
                    // This is a placeholder - implement the actual navigation if needed
                    navigate(`/bookings/${notification.relatedBookingId}`);
                  }}
                >
                  View Booking Details
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default NotificationDetailPage;