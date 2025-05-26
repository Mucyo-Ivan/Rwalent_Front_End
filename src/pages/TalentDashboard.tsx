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
} from 'recharts';
import {
  Calendar,
  DollarSign,
  Star,
  User,
  Settings,
  MessageSquare,
  TrendingUp,
  Award,
  Clock,
  Percent,
  AlertTriangle,
  CircleDollarSign,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import EnhancedAvatar from "@/components/ui/EnhancedAvatar";
import { dashboardService } from "@/lib/api/dashboard-service";
import { BookingStatus, TalentDashboardData } from "@/lib/interfaces/dashboard";

// Color constants for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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
      // First try to get consolidated dashboard data
      let dashboardResponse;
      try {
        dashboardResponse = await dashboardService.getTalentDashboardData();
      } catch (error) {
        // If main endpoint fails, collect data from individual endpoints
        console.log('Main dashboard endpoint not available, fetching from individual endpoints');
        dashboardResponse = {
          profileCompletion: 75, // Default value
          profileViews: 0,
          totalBookings: 0,
          pendingBookings: 0,
          confirmedBookings: 0,
          completedBookings: 0,
          canceledBookings: 0,
          earnings: {
            total: 0,
            thisMonth: 0,
            lastMonth: 0,
            thisYear: 0
          },
          ratings: {
            average: 0,
            total: 0,
            distribution: []
          },
          recentBookings: [],
          upcomingBookings: [],
          serviceDistribution: [],
          bookingsByLocation: [],
          recentReviews: [],
          monthlyBookings: [],
          bookingTrends: []
        };
      }
      
      // Fetch additional data from separate endpoints
      const [
        monthlyBookingsResponse,
        earningsResponse,
        bookingDistributionResponse,
        recentBookingsResponse,
        upcomingBookingsResponse,
        bookingTrendsResponse,
        recentReviewsResponse
      ] = await Promise.all([
        dashboardService.getMonthlyBookings(new Date().getFullYear()).catch(() => []),
        dashboardService.getEarningsData(earningsPeriod).catch(() => ({})),
        dashboardService.getBookingDistribution().catch(() => []),
        dashboardService.getRecentBookings(5).catch(() => []),
        dashboardService.getRecentBookings(5).catch(() => []), // Using same endpoint for upcoming bookings
        dashboardService.getBookingTrends(timeRange).catch(() => []),
        dashboardService.getRecentReviews(3).catch(() => [])
      ]);
      
      // Merge data from individual endpoints into main response
      if (monthlyBookingsResponse?.length) {
        dashboardResponse.monthlyBookings = monthlyBookingsResponse;
      }
      
      if (earningsResponse) {
        dashboardResponse.earnings = {
          ...dashboardResponse.earnings,
          ...earningsResponse
        };
      }
      
      if (bookingDistributionResponse?.length) {
        dashboardResponse.serviceDistribution = bookingDistributionResponse;
      }
      
      if (recentBookingsResponse?.length) {
        dashboardResponse.recentBookings = recentBookingsResponse;
      }
      
      if (upcomingBookingsResponse?.length) {
        dashboardResponse.upcomingBookings = upcomingBookingsResponse;
      }
      
      if (bookingTrendsResponse?.length) {
        dashboardResponse.bookingTrends = bookingTrendsResponse;
      }
      
      if (recentReviewsResponse?.length) {
        dashboardResponse.recentReviews = recentReviewsResponse;
      }
      
      setDashboardData(dashboardResponse);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle booking approval/rejection
  const handleBookingAction = async (bookingId: number, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await dashboardService.approveBooking(bookingId);
        toast.success('Booking approved successfully!');
      } else {
        await dashboardService.rejectBooking(bookingId);
        toast.success('Booking rejected successfully!');
      }
      
      // Refresh the dashboard data
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      toast.error(`Failed to ${action} booking. Please try again.`);
    }
  };
  
  // Refresh data when parameters change
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, earningsPeriod, refreshKey]); // fetchDashboardData is intentionally omitted from deps

  // Get formatted earnings data
  const formattedEarnings = useMemo(() => {
    if (!dashboardData?.earnings) {
      return {
        current: 'RWF 0',
        change: 0,
        changePercentage: '0'
      };
    }
    
    const current = dashboardData.earnings.thisMonth || 0;
    const previous = dashboardData.earnings.lastMonth || 0;
    const change = current - previous;
    const changePercentage = previous > 0 ? ((change / previous) * 100).toFixed(1) : '0';
    
    return {
      current: currencyFormatter.format(current),
      change,
      changePercentage
    };
  }, [dashboardData?.earnings]);

  // Loading skeleton
  if (loading && !dashboardData) {
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
                <Skeleton className="h-8 w-[100px] mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
              </CardHeader>
              <CardContent className="h-[350px] flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
              </CardHeader>
              <CardContent className="h-[350px] flex items-center justify-center">
                <Skeleton className="h-full w-full rounded-full" />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
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
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Talent Dashboard</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Loading skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-10 w-24" />
                </div>
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
  
  // Error state
  if (error || !dashboardData) {
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
              <h2 className="text-2xl font-bold">Unable to Load Dashboard</h2>
              <p className="text-muted-foreground max-w-md">
                {error || "There was an error loading your dashboard data. Please try again later."}
              </p>
              <Button 
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-8">
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
              onClick={() => navigate('/talent/settings')}
              className="flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.profileViews}</div>
              <p className="text-xs text-muted-foreground">Profile views this month</p>
              <Progress value={dashboardData.profileCompletion} className="mt-2 h-2" />
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formattedEarnings.current}</div>
              <p className={`text-xs ${formattedEarnings.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formattedEarnings.change > 0 ? '+' : ''}{formattedEarnings.changePercentage}% from last month
              </p>
            </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {dashboardData?.ratings?.average || 0}
              <span className="text-yellow-400 ml-1 flex">
                <Star className="h-5 w-5 fill-current" />
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              From {dashboardData?.ratings?.total || 0} reviews
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.profileCompletion || 0}%</div>
            <Progress 
              className={`h-2 mt-2 ${(dashboardData?.profileCompletion || 0) < 70 ? 'bg-amber-500' : 'bg-green-500'}`} 
              value={dashboardData?.profileCompletion || 0}
            />
            {(dashboardData?.profileCompletion || 0) < 100 && (
              <p className="text-xs text-muted-foreground mt-2">
                Complete your profile to attract more clients
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Booking Trends</CardTitle>
                <Select
                  value={timeRange}
                  onValueChange={(value) => setTimeRange(value as 'week' | 'month' | 'year')}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="h-[300px]">
                {dashboardData?.bookingTrends && dashboardData.bookingTrends.length > 0 ? (
                  <div className="w-full h-full">
                    <ResponsiveContainer>
                      <BarChart data={dashboardData.bookingTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="bookings" fill="#047857" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No booking trends data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Categories</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {dashboardData?.serviceDistribution && dashboardData.serviceDistribution.length > 0 ? (
                  <div className="w-full h-full">
                    <ResponsiveContainer>
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
                          label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                        >
                          {dashboardData?.serviceDistribution?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No service category data available</p>
                  </div>
                )}
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
                {(dashboardData?.upcomingBookings?.length || dashboardData?.recentBookings?.length) > 0 ? 
                  (dashboardData?.upcomingBookings || dashboardData?.recentBookings)?.map((booking) => (
                    <div key={booking.id} className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="flex-grow">
                        <p className="font-semibold text-sm">{booking.clientName}</p>
                        <p className="text-xs text-gray-500">{new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
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
                        {booking.status === 'PENDING' && (
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 px-2 text-xs bg-green-50 hover:bg-green-100 text-green-700"
                              onClick={() => handleBookingAction(booking.id, 'approve')}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 px-2 text-xs bg-red-50 hover:bg-red-100 text-red-700"
                              onClick={() => handleBookingAction(booking.id, 'reject')}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )) 
                : 
                  <p className="text-sm text-gray-500 text-center py-4">No upcoming bookings.</p>
                }
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-white">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" /> Latest Reviews
                </CardTitle>
                <CardDescription>
                  Real-time feedback from your clients
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : dashboardData?.recentReviews && dashboardData.recentReviews.length > 0 ? (
                  <div className="divide-y">
                    {dashboardData.recentReviews.map((review, index) => (
                      <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-rwanda-green/10 flex items-center justify-center text-rwanda-green font-medium overflow-hidden">
                            {/* Using the first letter of clientName since userAvatar doesn't exist */}
                            {review.clientName?.[0]?.toUpperCase() || 'C'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{review.clientName}</p>
                              <time className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</time>
                            </div>
                            <div className="flex items-center mt-1 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-3.5 w-3.5 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'}`} 
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center mb-3">
                      <Star className="h-6 w-6 text-yellow-500" />
                    </div>
                    <p className="text-gray-500 mb-2">No reviews yet</p>
                    <p className="text-sm text-gray-400">When clients leave reviews, they'll appear here</p>
                  </div>
                )}
              </CardContent>
              <div className="bg-gray-50 px-4 py-2.5 text-right">
                <Button 
                  variant="link" 
                  className="text-rwanda-green hover:text-rwanda-green/80 text-sm flex items-center justify-end w-full"
                  onClick={() => navigate('/talent/reviews')}
                >
                  View all reviews <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3.5 w-3.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </Button>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-3 justify-start items-center group" onClick={() => navigate('/talent/bookings')}>
                  <Calendar className="h-5 w-5 mr-3 text-gray-500 group-hover:text-green-600" />
                  <span className="text-sm font-medium">Schedule</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 justify-start items-center group" onClick={() => navigate('/talent/messages')}>
                  <MessageSquare className="h-5 w-5 mr-3 text-gray-500 group-hover:text-green-600" />
                  <span className="text-sm font-medium">Messages</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 justify-start items-center group" onClick={() => navigate('/talent/settings')}>
                  <Settings className="h-5 w-5 mr-3 text-gray-500 group-hover:text-green-600" />
                  <span className="text-sm font-medium">Settings</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 justify-start items-center group" onClick={() => navigate('/talent/profile')}>
                  <User className="h-5 w-5 mr-3 text-gray-500 group-hover:text-green-600" />
                  <span className="text-sm font-medium">Profile</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentDashboard;
