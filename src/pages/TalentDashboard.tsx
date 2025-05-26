import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
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
  Clock,
  Users,
  Eye,
  Percent,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CircleDollarSign,
  BarChart2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import EnhancedAvatar from "@/components/ui/EnhancedAvatar";
import { dashboardService } from "@/lib/api/dashboard-service";
import { BookingStatus, TalentDashboardData } from "@/lib/interfaces/dashboard";

// Color constants for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const BOOKING_STATUS_COLORS = {
  PENDING: '#f59e0b',    // Amber
  CONFIRMED: '#10b981',  // Emerald
  COMPLETED: '#3b82f6',  // Blue
  CANCELED: '#ef4444',   // Red
  REJECTED: '#6b7280'    // Gray
};

// Currency formatter
const currencyFormatter = new Intl.NumberFormat('en-RW', {
  style: 'currency',
  currency: 'RWF',
  minimumFractionDigits: 0
});

// Date formatter
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
});

const TalentDashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [dashboardData, setDashboardData] = useState<TalentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [earningsPeriod, setEarningsPeriod] = useState<'month' | 'year' | 'all'>('month');
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger data refresh

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const dashboardResponse = await dashboardService.getTalentDashboardData();
      const monthlyBookingsResponse = await dashboardService.getMonthlyBookings(new Date().getFullYear());
      const earningsResponse = await dashboardService.getEarningsData(earningsPeriod);
      const bookingDistributionResponse = await dashboardService.getBookingDistribution();
      const recentBookingsResponse = await dashboardService.getRecentBookings(5);
      const bookingTrendsResponse = await dashboardService.getBookingTrends(timeRange);
      const recentReviewsResponse = await dashboardService.getRecentReviews(3);
      
      // Combine all data
      const combinedData: TalentDashboardData = {
        ...dashboardResponse,
        monthlyBookings: monthlyBookingsResponse,
        bookingTrends: bookingTrendsResponse,
        recentBookings: recentBookingsResponse,
        serviceDistribution: bookingDistributionResponse,
        recentReviews: recentReviewsResponse,
        earnings: {
          ...dashboardResponse.earnings,
          ...earningsResponse
        }
      };
      
      setDashboardData(combinedData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      toast.error('Could not load dashboard data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh data when parameters change
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, earningsPeriod, refreshKey]); // fetchDashboardData is intentionally omitted from deps

  // Data derivation helpers
  const getStatusCount = useMemo(() => {
    if (!dashboardData) return {};
    
    return {
      pending: dashboardData.pendingBookings,
      confirmed: dashboardData.confirmedBookings,
      completed: dashboardData.completedBookings,
      canceled: dashboardData.canceledBookings,
      total: dashboardData.totalBookings
    };
  }, [dashboardData]);
  
  // Get formatted earnings data
  const formattedEarnings = useMemo(() => {
    if (!dashboardData?.earnings) return {
      total: 'RWF 0',
      thisMonth: 'RWF 0',
      lastMonth: 'RWF 0',
      change: 0,
      changePercentage: '0'
    };
    
    const { total, thisMonth, lastMonth } = dashboardData.earnings;
    const change = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;
    
    return {
      total: currencyFormatter.format(total),
      thisMonth: currencyFormatter.format(thisMonth),
      lastMonth: currencyFormatter.format(lastMonth),
      change: change, // Keep as number for comparisons
      changePercentage: change.toFixed(1) // String for display
    };
  }, [dashboardData]);
  
  // Handle booking approval/rejection
  const handleBookingAction = async (bookingId: number, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await dashboardService.approveBooking(bookingId);
        toast.success('Booking approved successfully');
      } else {
        await dashboardService.rejectBooking(bookingId);
        toast.success('Booking rejected successfully');
      }
      
      // Refresh dashboard data
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      toast.error(`Failed to ${action} booking. Please try again.`);
    }
  };
  
  // Loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-[80px] mb-2" />
                <Skeleton className="h-4 w-[150px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <Skeleton className="h-6 w-[180px]" />
              <Skeleton className="h-8 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
        
        {/* Recent bookings skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start space-x-4 mb-4 pb-4 border-b last:border-0">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-[120px] mb-2" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <Skeleton className="h-8 w-[80px]" />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Ensure dashboardData exists before rendering main content
  if (!dashboardData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Talent Dashboard</h1>
          <Button variant="outline" onClick={() => setRefreshKey(prev => prev + 1)}>
            Retry
          </Button>
        </div>
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
              <h2 className="text-xl font-semibold">No Dashboard Data Available</h2>
              <p className="text-muted-foreground max-w-md">
                Unable to retrieve dashboard data. Please try again.
              </p>
              <Button onClick={() => setRefreshKey(prev => prev + 1)}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Talent Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your talent profile.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="flex items-center gap-1"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-rwanda-green hover:bg-rwanda-green/90 text-white"
            onClick={() => navigate('/talent/profile')}
          >
            <User className="h-4 w-4 mr-2" />
            View Profile
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.completedBookings} completed, {dashboardData.pendingBookings} pending
            </p>
            <Progress className="h-1 mt-2" value={(dashboardData.completedBookings / dashboardData.totalBookings) * 100} />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedEarnings.thisMonth}</div>
            <div className="flex items-center pt-1">
              {formattedEarnings.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-500 mr-1 rotate-180" />
              )}
              <p className={`text-xs ${formattedEarnings.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formattedEarnings.change > 0 ? '+' : ''}{formattedEarnings.changePercentage}% from last month
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {dashboardData.ratings?.average || 0}
              <span className="text-yellow-400 ml-1 flex">
                <Star className="h-5 w-5 fill-current" />
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              From {dashboardData.ratings.total} reviews
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.profileCompletion}%</div>
            <Progress 
              className={`h-2 mt-2 ${dashboardData.profileCompletion < 70 ? 'bg-amber-500' : 'bg-green-500'}`} 
              value={dashboardData.profileCompletion}
            />
            {dashboardData.profileCompletion < 100 && (
              <p className="text-xs text-muted-foreground mt-2">
                Complete your profile to attract more clients
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Bookings Chart */}
        <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Monthly Bookings & Revenue</CardTitle>
              <CardDescription>Overview of your bookings and earnings per month</CardDescription>
            </div>
            <Select value={earningsPeriod} onValueChange={(value) => setEarningsPeriod(value as 'month' | 'year' | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="count" name="Bookings" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="revenue" name="Revenue (RWF)" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Distribution Pie Chart */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
            <CardDescription>Breakdown of your booking types</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.serviceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="category"
                  label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                >
                  {dashboardData.serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} bookings`, props.payload.category]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings and Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings */}
        <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your most recent booking activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {dashboardData.recentBookings.length > 0 ? (
                dashboardData.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-start space-x-4">
                    <EnhancedAvatar
                      size="md"
                      name={booking.clientName}
                      photoUrl={null}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">{booking.clientName}</p>
                        <Badge
                          variant="outline"
                          className={`${
                            booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-200' :
                            booking.status === 'CANCELED' ? 'bg-red-100 text-red-800 border-red-200' :
                            booking.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            'bg-blue-100 text-blue-800 border-blue-200'
                          }`}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.date).toLocaleDateString()} at {booking.time} • {booking.location}
                      </p>
                      <p className="text-sm font-medium">{currencyFormatter.format(booking.price)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No recent bookings found</p>
                </div>
              )}

              <div className="flex justify-center pt-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/talent/bookings')}>
                  View All Bookings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews and Rating */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>What clients are saying about you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentReviews.length > 0 ? (
                dashboardData.recentReviews.map((review) => (
                  <div key={review.id} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{review.clientName}</p>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                    <p className="text-sm">"{review.comment}"</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No reviews yet</p>
                </div>
              )}

              <div className="flex justify-center pt-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/talent/reviews')}>
                  View All Reviews
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      {dashboardData.pendingBookings > 0 && (
        <Card className="shadow-sm hover:shadow-md transition-shadow border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Pending Approvals
            </CardTitle>
            <CardDescription>Booking requests that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.upcomingBookings
                .filter(booking => booking.status === 'PENDING')
                .map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-white rounded-md shadow-sm">
                    <div className="flex items-start space-x-4">
                      <EnhancedAvatar size="md" name={booking.clientName} photoUrl={null} />
                      <div>
                        <p className="font-medium">{booking.clientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </p>
                        <p className="text-sm">{booking.location}</p>
                        <p className="text-sm font-medium">{currencyFormatter.format(booking.price)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 hover:bg-red-100 text-red-600"
                        onClick={() => handleBookingAction(booking.id, 'reject')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-200 hover:bg-green-100 text-green-600"
                        onClick={() => handleBookingAction(booking.id, 'approve')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
            <Progress value={(dashboardData.completedBookings / dashboardData.totalBookings) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RWF {dashboardData.earnings.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
            <Progress value={(dashboardData.earnings.thisMonth / dashboardData.earnings.total) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            <Progress value={(dashboardData.pendingBookings / dashboardData.totalBookings) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Bookings</CardTitle>
            <Award className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.completedBookings}</div>
            <p className="text-xs text-muted-foreground">Successful bookings</p>
            <Progress value={(dashboardData.completedBookings / dashboardData.totalBookings) * 100} className="mt-2 h-2" />
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
                <BarChart data={dashboardData.bookingTrends}>
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
                    data={dashboardData.serviceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    nameKey="category"
                    dataKey="count"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {dashboardData.serviceDistribution.map((entry, index) => (
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
              {(dashboardData.upcomingBookings?.length || dashboardData.recentBookings?.length) > 0 ? (dashboardData.upcomingBookings || dashboardData.recentBookings).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div>
                    <p className="font-semibold text-sm">{booking.clientName}</p>
                    <p className="text-xs text-gray-500">{new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                    <Badge 
                    variant={booking.status === BookingStatus.CONFIRMED ? 'default' : booking.status === BookingStatus.PENDING ? 'secondary' : 'outline'}
                    className={`text-xs px-2 py-0.5 ${
                      booking.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-700' : 
                      booking.status === BookingStatus.PENDING ? 'bg-yellow-100 text-yellow-700' : 
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