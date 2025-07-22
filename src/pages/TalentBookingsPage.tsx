import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  CalendarCheck, User, DollarSign, AlertCircle, Clock, Check, X, 
  Info, CheckCircle, Calendar, MapPin, Music, Star, Phone, Mail,
  MessageSquare, FileText, CreditCard, Zap, Flame, CheckSquare, RotateCcw, Timeline
} from 'lucide-react';
// ERASED: All booking API client imports, state, and logic
// TODO: Re-implement bookings integration
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useSpring, animated } from '@react-spring/web';

const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (status?.toUpperCase()) {
    case 'CONFIRMED':
      return 'default'; 
    case 'PENDING':
      return 'secondary'; 
    case 'COMPLETED':
      return 'outline'; 
    case 'CANCELLED':
    case 'REJECTED':
      return 'destructive'; 
    default:
      return 'outline';
  }
};

const POLLING_INTERVAL = 15000;

const TalentBookingsPage = () => {
  const { userProfile, loading: authLoading, isAuthenticated, refreshUserProfile } = useAuth();

  // ERASED: All booking API client imports, state, and logic
  // TODO: Re-implement bookings integration
  const [pendingBookings, setPendingBookings] = useState<any[]>([]); // Placeholder
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]); // Placeholder
  const [pastBookings, setPastBookings] = useState<any[]>([]); // Placeholder
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<'pending' | 'upcoming' | 'past'>('pending');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null); // Placeholder
  const [searchTerm, setSearchTerm] = useState('');

  // ERASED: All booking API client imports, state, and logic
  // TODO: Re-implement bookings integration
  const fetchBookings = useCallback(async (isInitialLoad = false) => {
    if (!userProfile?.id) {
      console.warn("User profile not loaded, cannot fetch bookings.");
      if (isInitialLoad) {
        setError("Please log in as a talent to view your bookings.");
        setLoading(false);
      }
      return;
    }
    if (isInitialLoad) setLoading(true);
    try {
      // Fetch pending bookings
      // ERASED: All booking API client imports, state, and logic
      // TODO: Re-implement bookings integration
      setPendingBookings([]); // Placeholder
      // Fetch all bookings for this talent
      // ERASED: All booking API client imports, state, and logic
      // TODO: Re-implement bookings integration
      const allTalentBookings = []; // Placeholder
      // Split into upcoming and past
      const now = new Date();
      const upcoming = allTalentBookings.filter(b => b.status === 'CONFIRMED' && new Date(b.bookingDate) > now);
      const past = allTalentBookings.filter(b => b.status === 'COMPLETED' || (b.status === 'CONFIRMED' && new Date(b.bookingDate) <= now));
      setUpcomingBookings(upcoming);
      setPastBookings(past);
      if (isInitialLoad) setError(null);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      if (isInitialLoad) {
        const errorMsg = err.response?.data?.detail || err.message || "Failed to load booking requests. Please try refreshing the page.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  }, [userProfile?.id]);

  useEffect(() => {
    if (!authLoading && userProfile?.id) {
      fetchBookings(true);
    const intervalId = setInterval(() => {
        fetchBookings(false);
    }, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
    }
  }, [authLoading, userProfile?.id, fetchBookings]);

  // ERASED: All booking API client imports, state, and logic
  // TODO: Re-implement bookings integration
  const handleApprove = async (bookingId: number) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: true }));
    try {
      // ERASED: All booking API client imports, state, and logic
      // TODO: Re-implement bookings integration
      toast.success("Booking request approved successfully");
      fetchBookings(false);
    } catch (err) {
      console.error("Error approving booking:", err);
      toast.error("Failed to approve booking. Please try again.");
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  // ERASED: All booking API client imports, state, and logic
  // TODO: Re-implement bookings integration
  const handleReject = async (bookingId: number) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: true }));
    try {
      // ERASED: All booking API client imports, state, and logic
      // TODO: Re-implement bookings integration
      toast.success("Booking request declined");
      fetchBookings(false);
    } catch (err) {
      console.error("Error rejecting booking:", err);
      toast.error("Failed to decline booking. Please try again.");
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-rwanda-green mb-6"></div>
        <p className="text-lg text-gray-600">Loading your profile...</p>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <img src="/login-illustration.svg" alt="Login required" className="w-40 h-40 mb-6 opacity-80" />
        <p className="text-xl font-semibold text-gray-700 mb-2">Please log in to view your bookings.</p>
        <Button onClick={() => window.location.href = '/signin'} className="bg-rwanda-green hover:bg-rwanda-green/90 text-white px-8 py-3 text-lg font-semibold">Log In</Button>
      </div>
    );
  }
  if (!userProfile?.id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-rwanda-green mb-6"></div>
        <p className="text-lg text-gray-600 mb-4">Loading your profile...</p>
        <Button onClick={refreshUserProfile} className="bg-rwanda-green hover:bg-rwanda-green/90 text-white px-8 py-3 text-lg font-semibold">Refresh</Button>
      </div>
    );
  }

  // Booking stats
  const totalBookings = pendingBookings.length + upcomingBookings.length + pastBookings.length;
  const approvedCount = upcomingBookings.length + pastBookings.filter(b => b.status === 'COMPLETED').length;
  const rejectedCount = pastBookings.filter(b => b.status === 'REJECTED' || b.status === 'CANCELLED').length;
  const totalRevenue = [...upcomingBookings, ...pastBookings].reduce((sum, b) => sum + (b.agreedPrice || 0), 0);

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      {/* Booking Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-rwanda-green">{totalBookings}</span>
          <span className="text-xs text-gray-500 mt-1">Total Bookings</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-green-600">{approvedCount}</span>
          <span className="text-xs text-gray-500 mt-1">Approved</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-red-500">{rejectedCount}</span>
          <span className="text-xs text-gray-500 mt-1">Rejected</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-600">RWF {totalRevenue.toLocaleString()}</span>
          <span className="text-xs text-gray-500 mt-1">Total Revenue</span>
        </div>
      </div>
      {/* Tabs for bookings */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="flex gap-2">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2 mt-4 mb-6">
          <Input
            placeholder="Search by client name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        {/* Pending Bookings Tab */}
        <TabsContent value="pending">
          {error && !loading && (
            <div className="bg-red-50 text-red-600 p-6 rounded-lg border border-red-200 text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => fetchBookings(true)}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-rwanda-green mb-6"></div>
              <p className="text-lg text-gray-600">Loading bookings...</p>
            </div>
          ) : pendingBookings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pendingBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden shadow-xl border-l-8 border-l-yellow-400 hover:shadow-2xl transition-all flex flex-col justify-between">
                  <CardHeader className="pb-2 bg-yellow-50/50 flex flex-row items-center gap-3">
                    <Avatar className="h-14 w-14 border-2 border-yellow-100 bg-yellow-50">
                      <AvatarImage src={''} alt={booking.userName || 'Client'} />
                      <AvatarFallback className="bg-yellow-50 text-xl">
                        {booking.userName ? booking.userName.charAt(0).toUpperCase() : <User className="h-7 w-7 text-yellow-600" />}
                          </AvatarFallback>
                        </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-gray-800">{booking.userName || 'Client'}</CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1 text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>Requested {format(parseISO(booking.createdAt || new Date().toISOString()), 'MMM d, yyyy')}</span>
                          </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
                  </CardHeader>
                  <CardContent className="pt-4 pb-2 space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{format(parseISO(booking.bookingDate), 'EEEE, MMMM d, yyyy')}</span>
                      <span className="text-xs text-gray-500">{format(parseISO(booking.bookingDate), 'h:mm a')} · {booking.durationMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{booking.eventLocation}</span>
                    </div>
                    {booking.notes && (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span>{booking.notes}</span>
                      </div>
                    )}
                    {booking.eventRequirements && (
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-medium text-gray-700">Requirements:</span>
                          <span className="block">{booking.eventRequirements}</span>
                        </div>
                      </div>
                    )}
                    {booking.agreedPrice && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Agreed Price: <span className="text-rwanda-blue">RWF {booking.agreedPrice.toLocaleString()}</span></span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2 pt-4 bg-gray-50">
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                        onClick={() => handleReject(booking.id)}
                        disabled={actionLoading[booking.id]}
                      >
                        <X className="h-5 w-5 mr-2" />
                        {actionLoading[booking.id] ? "Rejecting..." : "Reject"}
                      </Button>
                      <Button
                        size="lg"
                        className="flex-1 bg-rwanda-green hover:bg-rwanda-green/90 text-white"
                        onClick={() => handleApprove(booking.id)}
                        disabled={actionLoading[booking.id]}
                      >
                        <Check className="h-5 w-5 mr-2" />
                        {actionLoading[booking.id] ? "Approving..." : "Approve"}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <img src="/empty-bookings.svg" alt="No bookings" className="w-32 h-32 mb-6 opacity-70" />
              <p className="text-xl font-medium text-gray-500">No Pending Booking Requests</p>
              <p className="mt-2 text-gray-400">You're all caught up! Check back later for new requests.</p>
            </div>
          )}
        </TabsContent>
        {/* Upcoming Bookings Tab */}
        <TabsContent value="upcoming">
          {error && !loading && (
            <div className="bg-red-50 text-red-600 p-6 rounded-lg border border-red-200 text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => fetchBookings(true)}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-rwanda-green mb-6"></div>
              <p className="text-lg text-gray-600">Loading bookings...</p>
            </div>
          ) : upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden shadow-xl border-l-8 border-l-blue-400 hover:shadow-2xl transition-all flex flex-col justify-between">
                  <CardHeader className="pb-2 bg-blue-50/50 flex flex-row items-center gap-3">
                    <Avatar className="h-14 w-14 border-2 border-blue-100 bg-blue-50">
                      <AvatarImage src={''} alt={booking.userName || 'Client'} />
                      <AvatarFallback className="bg-blue-50 text-xl">
                        {booking.userName ? booking.userName.charAt(0).toUpperCase() : <User className="h-7 w-7 text-blue-600" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-gray-800">{booking.userName || 'Client'}</CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1 text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{format(parseISO(booking.bookingDate), 'EEEE, MMMM d, yyyy')}</span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Upcoming</Badge>
                  </CardHeader>
                  <CardContent className="pt-4 pb-2 space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{format(parseISO(booking.bookingDate), 'EEEE, MMMM d, yyyy')}</span>
                      <span className="text-xs text-gray-500">{format(parseISO(booking.bookingDate), 'h:mm a')} · {booking.durationMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{booking.eventLocation}</span>
                    </div>
                    {booking.notes && (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span>{booking.notes}</span>
                      </div>
                    )}
                    {booking.eventRequirements && (
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-medium text-gray-700">Requirements:</span>
                          <span className="block">{booking.eventRequirements}</span>
                        </div>
                      </div>
                    )}
                    {booking.agreedPrice && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Agreed Price: <span className="text-rwanda-blue">RWF {booking.agreedPrice.toLocaleString()}</span></span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2 pt-4 bg-gray-50">
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 border-blue-400 text-blue-700 hover:bg-blue-100"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <Info className="h-5 w-5 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <img src="/empty-bookings.svg" alt="No bookings" className="w-32 h-32 mb-6 opacity-70" />
              <p className="text-xl font-medium text-gray-500">No Upcoming Bookings</p>
              <p className="mt-2 text-gray-400">You have no upcoming performances scheduled.</p>
            </div>
          )}
        </TabsContent>
        {/* Past Bookings Tab */}
        <TabsContent value="past">
          {error && !loading && (
            <div className="bg-red-50 text-red-600 p-6 rounded-lg border border-red-200 text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => fetchBookings(true)}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-rwanda-green mb-6"></div>
              <p className="text-lg text-gray-600">Loading bookings...</p>
            </div>
          ) : pastBookings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden shadow-xl border-l-8 border-l-gray-400 hover:shadow-2xl transition-all flex flex-col justify-between">
                  <CardHeader className="pb-2 bg-gray-50/50 flex flex-row items-center gap-3">
                    <Avatar className="h-14 w-14 border-2 border-gray-100 bg-gray-50">
                      <AvatarImage src={''} alt={booking.userName || 'Client'} />
                      <AvatarFallback className="bg-gray-50 text-xl">
                        {booking.userName ? booking.userName.charAt(0).toUpperCase() : <User className="h-7 w-7 text-gray-600" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-gray-800">{booking.userName || 'Client'}</CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1 text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{format(parseISO(booking.bookingDate), 'EEEE, MMMM d, yyyy')}</span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Past</Badge>
                  </CardHeader>
                  <CardContent className="pt-4 pb-2 space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{format(parseISO(booking.bookingDate), 'EEEE, MMMM d, yyyy')}</span>
                      <span className="text-xs text-gray-500">{format(parseISO(booking.bookingDate), 'h:mm a')} · {booking.durationMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{booking.eventLocation}</span>
                    </div>
                      {booking.notes && (
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span>{booking.notes}</span>
                        </div>
                      )}
                      {booking.eventRequirements && (
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                          <span className="text-xs font-medium text-gray-700">Requirements:</span>
                          <span className="block">{booking.eventRequirements}</span>
                          </div>
                        </div>
                      )}
                      {booking.agreedPrice && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Agreed Price: <span className="text-rwanda-blue">RWF {booking.agreedPrice.toLocaleString()}</span></span>
                        </div>
                      )}
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2 pt-4 bg-gray-50">
                    <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                        size="lg"
                        className="flex-1 border-gray-400 text-gray-700 hover:bg-gray-100"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <Info className="h-5 w-5 mr-2" />
                        View Details
                    </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <img src="/empty-bookings.svg" alt="No bookings" className="w-32 h-32 mb-6 opacity-70" />
              <p className="text-xl font-medium text-gray-500">No Past Bookings</p>
              <p className="mt-2 text-gray-400">You have no past performances.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-8 relative animate-slideUp">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setSelectedBooking(null)}>
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-2">Booking Details</h2>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="font-medium">{selectedBooking.userName || 'Client'}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>{format(parseISO(selectedBooking.bookingDate), 'PPPpp')}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span>{selectedBooking.eventLocation}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <span>RWF {selectedBooking.agreedPrice?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span>{selectedBooking.durationMinutes} min</span>
              </div>
              {selectedBooking.notes && (
                <div className="flex items-start gap-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-gray-500 mt-0.5" />
                  <span>{selectedBooking.notes}</span>
                </div>
              )}
              {selectedBooking.eventRequirements && (
                <div className="flex items-start gap-2 mb-2">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  <span>{selectedBooking.eventRequirements}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <span>{selectedBooking.userEmail || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-500" />
                <span>{selectedBooking.userPhone || 'N/A'}</span>
              </div>
            </div>
          </div>
          </div>
      )}
    </div>
  );
};

export default TalentBookingsPage; 