import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Calendar, 
  DollarSign, 
  Star, 
  User, 
  Settings, 
  Bell, 
  MessageSquare,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { auth } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardData {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  upcomingBookings: Array<{
    id: number;
    date: string;
    clientName: string;
    status: string;
  }>;
  recentReviews: Array<{
    id: number;
    rating: number;
    comment: string;
    clientName: string;
    date: string;
  }>;
  earnings: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  bookingTrends: Array<{
    month: string;
    bookings: number;
  }>;
  serviceCategories: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TalentDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const response = await auth.getTalentDashboardData();
      setData(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      toast.error('Could not load dashboard data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-5 w-5" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-2 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button 
          onClick={fetchDashboardData}
          className="mt-4 bg-rwanda-green hover:bg-rwanda-green/90"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
            <Progress value={(data.completedBookings / data.totalBookings) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RWF {data.earnings.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
            <Progress value={(data.earnings.thisMonth / data.earnings.total) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            <Progress value={(data.pendingBookings / data.totalBookings) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Bookings</CardTitle>
            <Award className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.completedBookings}</div>
            <p className="text-xs text-muted-foreground">Successful bookings</p>
            <Progress value={(data.completedBookings / data.totalBookings) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.bookingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#047857" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
               <CardTitle>Service Categories</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.serviceCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.serviceCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Activity & Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.upcomingBookings.length > 0 ? data.upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div>
                    <p className="font-semibold text-sm">{booking.clientName}</p>
                    <p className="text-xs text-gray-500">{new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                    <Badge 
                    variant={booking.status === 'CONFIRMED' ? 'default' : booking.status === 'PENDING' ? 'secondary' : 'outline'}
                    className={`text-xs px-2 py-0.5 ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}
                    >
                      {booking.status}
                    </Badge>
                </div>
              )) : <p className="text-sm text-gray-500 text-center py-4">No upcoming bookings.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-3 justify-start items-center group" onClick={() => navigate('/talent/bookings')}>
                <Calendar className="h-5 w-5 mr-3 text-gray-500 group-hover:text-rwanda-green" />
                <span className="text-sm font-medium">Schedule</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 justify-start items-center group" onClick={() => navigate('/talent/messages')}>
                <MessageSquare className="h-5 w-5 mr-3 text-gray-500 group-hover:text-rwanda-green" />
                <span className="text-sm font-medium">Messages</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 justify-start items-center group" onClick={() => navigate('/talent/settings')}>
                <Settings className="h-5 w-5 mr-3 text-gray-500 group-hover:text-rwanda-green" />
                <span className="text-sm font-medium">Settings</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 justify-start items-center group" onClick={() => navigate('/talent/profile')}>
                <User className="h-5 w-5 mr-3 text-gray-500 group-hover:text-rwanda-green" />
                <span className="text-sm font-medium">Profile</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TalentDashboard; 