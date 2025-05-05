
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, Clock } from "lucide-react";

// Mock booking data for demonstration
interface Booking {
  id: string;
  clientName: string;
  date: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  service: string;
  location: string;
  price: string;
}

const TalentDashboardPage = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  useEffect(() => {
    // Check if user is a talent, if not redirect to home
    if (userProfile && userProfile.role !== "talent") {
      navigate("/");
      return;
    }
    
    // Mock API call to fetch bookings
    const fetchBookings = () => {
      // This would be replaced with an actual API call
      const mockBookings: Booking[] = [
        {
          id: "b1",
          clientName: "John Doe",
          date: "2025-06-15T18:00:00",
          status: "pending",
          service: "Live Music Performance",
          location: "Kigali, Rwanda",
          price: "250,000 RWF"
        },
        {
          id: "b2",
          clientName: "Sarah Smith",
          date: "2025-06-20T14:00:00",
          status: "confirmed",
          service: "Photography Session",
          location: "Musanze, Rwanda",
          price: "150,000 RWF"
        },
        {
          id: "b3",
          clientName: "David Johnson",
          date: "2025-05-30T16:00:00",
          status: "completed",
          service: "DJ Services",
          location: "Kigali, Rwanda",
          price: "200,000 RWF"
        }
      ];
      
      setBookings(mockBookings);
    };
    
    fetchBookings();
  }, [userProfile, navigate]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const filteredBookings = (status: string) => {
    if (status === "all") return bookings;
    return bookings.filter(booking => booking.status === status);
  };

  return (
    <div className="section-padding bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Talent Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your bookings and profile
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 text-rwanda-green mr-2" />
                <span className="text-2xl font-bold">{bookings.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">
                  {bookings.filter(b => b.status === "pending").length}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Confirmed Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-rwanda-green mr-2" />
                <span className="text-2xl font-bold">
                  {bookings.filter(b => b.status === "confirmed").length}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completed Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">
                  {bookings.filter(b => b.status === "completed").length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Booking Requests</CardTitle>
            <CardDescription>
              View and manage all your booking requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Bookings</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {bookings.length > 0 ? (
                  bookings.map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <EmptyState />
                )}
              </TabsContent>
              
              <TabsContent value="pending" className="space-y-4">
                {filteredBookings("pending").length > 0 ? (
                  filteredBookings("pending").map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <EmptyState message="No pending booking requests" />
                )}
              </TabsContent>
              
              <TabsContent value="confirmed" className="space-y-4">
                {filteredBookings("confirmed").length > 0 ? (
                  filteredBookings("confirmed").map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <EmptyState message="No confirmed bookings" />
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                {filteredBookings("completed").length > 0 ? (
                  filteredBookings("completed").map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <EmptyState message="No completed bookings" />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper components
const BookingCard = ({ booking }: { booking: Booking }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="font-medium">{booking.service}</h3>
          <p className="text-sm text-gray-600">Client: {booking.clientName}</p>
          <p className="text-sm text-gray-600">Location: {booking.location}</p>
          <div className="flex items-center gap-2 mt-2">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{formatDate(booking.date)}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end gap-2">
          <Badge className={`font-normal capitalize ${getStatusColor(booking.status)}`}>
            {booking.status}
          </Badge>
          <span className="font-semibold">{booking.price}</span>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message = "No bookings found" }) => {
  return (
    <div className="text-center py-8">
      <CalendarDays className="h-12 w-12 mx-auto text-gray-300" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings yet</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default TalentDashboardPage;
