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
  MessageSquare, FileText, CreditCard, Zap, Flame, CheckSquare, RotateCcw
} from 'lucide-react';
import { booking, BookingResponse } from '@/lib/api';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  const [pendingBookings, setPendingBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});

  const fetchPendingBookings = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
    try {
      // Fetch real booking data from the backend API
      const data = await booking.getPendingTalentBookings();
      
      // Process the data to ensure all required fields exist
      const processedData = data.map(booking => ({
        ...booking,
        // Ensure essential fields exist to prevent UI errors
        createdAt: booking.createdAt || new Date().toISOString(),
        userName: booking.userName || 'Client',
        eventLocation: booking.eventLocation || 'No location specified',
        bookingDate: booking.bookingDate || new Date().toISOString(),
        durationMinutes: booking.durationMinutes || 60
      }));
      
      setPendingBookings(processedData);
      if (isInitialLoad) setError(null);
      
      // Log success for debugging
      console.log(`Successfully fetched ${processedData.length} pending booking requests`);
    } catch (err) {
      console.error('Error fetching pending bookings:', err);
      // Only show error message on initial load to avoid spamming the user
      if (isInitialLoad) {
        setError("Failed to load booking requests. Please try refreshing the page.");
        toast.error("Could not load pending bookings");
      }
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingBookings(true);

    const intervalId = setInterval(() => {
      fetchPendingBookings(false);
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchPendingBookings]);

  const handleApprove = async (bookingId: number) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: true }));
    try {
      await booking.approveBooking(bookingId);
      setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
      toast.success("Booking request approved successfully");
    } catch (err) {
      toast.error("Failed to approve booking. Please try again.");
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleReject = async (bookingId: number) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: true }));
    try {
      await booking.rejectBooking(bookingId);
      setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
      toast.success("Booking request declined");
    } catch (err) {
      toast.error("Failed to decline booking. Please try again.");
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-rwanda-green" />
            My Bookings
          </h1>
          <p className="text-gray-600 mt-1">Manage all your booking requests and upcoming performances</p>
        </div>
        <Button 
          onClick={() => fetchPendingBookings(true)}
          className="mt-4 md:mt-0 bg-rwanda-green hover:bg-rwanda-green/90 text-white"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Refresh Bookings
        </Button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-8 w-full justify-start border-b pb-0 pt-0 overflow-x-auto">
          <TabsTrigger value="pending" className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-rwanda-green data-[state=active]:text-foreground data-[state=active]:shadow-none flex items-center gap-2">
            <Flame className="h-4 w-4" />
            <span className="relative">
              Pending Requests
              {pendingBookings.length > 0 && (
                <Badge className="ml-1 h-5 px-1.5 bg-rwanda-green absolute -top-2 -right-7">
                  {pendingBookings.length}
                </Badge>
              )}
            </span>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-rwanda-green data-[state=active]:text-foreground data-[state=active]:shadow-none flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="past" className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-rwanda-green data-[state=active]:text-foreground data-[state=active]:shadow-none flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Past Events
          </TabsTrigger>
        </TabsList>

        {/* Pending Requests Tab */}
        <TabsContent value="pending" className="space-y-6 mt-0">
          {error && !loading && (
            <div className="bg-red-50 text-red-600 p-6 rounded-lg border border-red-200 text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => fetchPendingBookings(true)}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : pendingBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-all border-l-4 border-l-yellow-400">
                  <CardHeader className="pb-2 bg-yellow-50/50">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-yellow-100 bg-yellow-50">
                          <AvatarImage 
                            src={''} 
                            alt={booking.userName || 'Client'}
                          />
                          <AvatarFallback className="bg-yellow-50">
                            {booking.userName ? booking.userName.charAt(0).toUpperCase() : <User className="h-5 w-5 text-yellow-600" />}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{booking.userName || 'Client'}</CardTitle>
                          <CardDescription className="text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Requested {format(parseISO(booking.createdAt || new Date().toISOString()), 'MMM d, yyyy')}</span>
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-2">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{format(parseISO(booking.bookingDate), 'EEEE, MMMM d, yyyy')}</p>
                          <p className="text-xs text-gray-500">{format(parseISO(booking.bookingDate), 'h:mm a')} · {booking.durationMinutes} minutes</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{booking.eventLocation}</p>
                      </div>
                      
                      {booking.notes && (
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{booking.notes}</p>
                        </div>
                      )}
                      
                      {booking.eventRequirements && (
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-gray-700">Requirements:</p>
                            <p className="text-sm">{booking.eventRequirements}</p>
                          </div>
                        </div>
                      )}
                      
                      {booking.agreedPrice && (
                        <div className="flex items-center gap-2 bg-green-50 rounded-md p-2">
                          <CreditCard className="h-4 w-4 text-green-600" />
                          <p className="text-sm font-medium text-green-700">${booking.agreedPrice.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 pb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                      onClick={() => handleReject(booking.id)}
                      disabled={actionLoading[booking.id]}
                    >
                      {actionLoading[booking.id] ? <Clock className="h-4 w-4 mr-1 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      className="bg-rwanda-green hover:bg-rwanda-green/90"
                      onClick={() => handleApprove(booking.id)}
                      disabled={actionLoading[booking.id]}
                    >
                      {actionLoading[booking.id] ? <Clock className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                      Accept Booking
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <CheckCircle className="h-16 w-16 mb-4 text-green-500" />
              <p className="text-xl font-medium">No pending booking requests</p>
              <p className="text-gray-500 mt-1">When clients request to book you, they'll appear here</p>
              <Button variant="outline" className="mt-6">
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Upcoming Tab (Placeholder) */}
        <TabsContent value="upcoming" className="space-y-6 mt-0">
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <Calendar className="h-16 w-16 mb-4 text-blue-500" />
            <p className="text-xl font-medium">No upcoming bookings</p>
            <p className="text-gray-500 mt-1">You don't have any confirmed bookings coming up</p>
          </div>
        </TabsContent>

        {/* Past Events Tab (Placeholder) */}
        <TabsContent value="past" className="space-y-6 mt-0">
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <CheckSquare className="h-16 w-16 mb-4 text-gray-400" />
            <p className="text-xl font-medium">No past events</p>
            <p className="text-gray-500 mt-1">Your completed bookings will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TalentBookingsPage; 