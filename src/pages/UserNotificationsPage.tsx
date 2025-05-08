import { useState, useEffect } from 'react';
import { notifications, UserNotification } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, XCircle, Clock, AlertCircle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import { parseISO } from 'date-fns';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'BOOKING_APPROVED':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'BOOKING_REJECTED':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'BOOKING_PENDING': // Example for pending
      return <Clock className="h-5 w-5 text-yellow-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const UserNotificationsPage = () => {
  const [userNotifications, setUserNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching historical user notifications...");
        const data = await notifications.getUserNotifications(); 
        setUserNotifications(data);
      } catch (err) {
        console.error("Error fetching user notifications:", err);
        setError("Failed to load notifications. The notification history endpoint might be unavailable.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id: number) => {
    console.log("Marking notification as read (frontend state update only):", id);
    setUserNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center text-2xl font-semibold text-gray-800">
            <Bell className="mr-3 h-6 w-6 text-rwanda-blue" />
            Your Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : userNotifications.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Info className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg">You have no notifications yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userNotifications.map((notification) => (
                <Card key={notification.id} className={`transition-all ${notification.isRead ? 'opacity-70 bg-muted/50' : 'bg-card'}`}>
                  <CardContent className="p-4 flex items-start space-x-4">
                    <div className="mt-1">
                       {getStatusIcon(notification.status)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm font-medium ${notification.isRead ? 'font-normal' : 'font-semibold'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                         <Clock className="h-3 w-3 mr-1.5"/>
                         {formatDistanceToNow(parseISO(notification.createdAt), { addSuffix: true })}
                      </p>
                      {notification.relatedBookingId && (
                        <Button 
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => navigate(`/bookings/${notification.relatedBookingId}`)}
                        >
                           View Booking Details
                        </Button>
                      )}
                    </div>
                    {!notification.isRead && (
                      <Button 
                         variant="outline"
                         size="sm"
                         className="text-xs h-7 px-2"
                         onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                     )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserNotificationsPage; 