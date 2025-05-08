import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarCheck, User, DollarSign, AlertCircle, Clock, Check, X, Info, CheckCircle } from 'lucide-react';
import { booking, BookingResponse } from '@/lib/api';
import { format, parseISO } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
      const data = await booking.getPendingTalentBookings();
      setPendingBookings(data);
      if (isInitialLoad) setError(null);
    } catch (err) {
      console.error("Error fetching pending bookings:", err);
      if (isInitialLoad) setError("Failed to load pending bookings. Retrying periodically...");
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
    } catch (err) {
      console.error("Failed to approve booking on page:", err);
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleReject = async (bookingId: number) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: true }));
    try {
      await booking.rejectBooking(bookingId);
      setPendingBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (err) {
      console.error("Failed to reject booking on page:", err);
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-6 w-6 mr-2 text-yellow-500" />
            Pending Booking Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && !loading && (
             <div className="text-center py-6 text-red-600">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>{error}</p>
             </div>
          )}
          {loading ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-md" />
              ))}
            </div>
          ) : pendingBookings.length > 0 ? (
            <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[130px] px-3 py-3.5">Client</TableHead>
                    <TableHead className="w-[180px] px-3 py-3.5">Date</TableHead>
                    <TableHead className="w-[90px] px-3 py-3.5">Duration</TableHead>
                    <TableHead className="min-w-[150px] px-3 py-3.5">Location</TableHead>
                    <TableHead className="min-w-[200px] px-3 py-3.5">Notes/Reqs</TableHead>
                    <TableHead className="w-[120px] text-right px-3 py-3.5">Price</TableHead>
                    <TableHead className="w-[180px] text-center px-3 py-3.5">Actions</TableHead> 
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingBookings.map((bookingItem) => (
                    <TableRow key={bookingItem.id} className="hover:bg-gray-50">
                      <TableCell className="px-3 py-3">
                        <div className="flex items-center font-medium text-sm">
                          <User className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                          {bookingItem.userName || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-3 text-sm">
                        {format(parseISO(bookingItem.bookingDate), 'MMM d, yyyy h:mm a')} 
                      </TableCell>
                      <TableCell className="px-3 py-3 text-sm">{bookingItem.durationMinutes} min</TableCell>
                      <TableCell className="px-3 py-3 text-sm max-w-[150px] truncate" title={bookingItem.eventLocation}>{bookingItem.eventLocation}</TableCell>
                      <TableCell className="px-3 py-3 text-sm max-w-[200px] truncate" title={`${bookingItem.notes}${bookingItem.eventRequirements ? ` | Requirements: ${bookingItem.eventRequirements}` : ''}`}>
                        {bookingItem.notes}
                        {bookingItem.eventRequirements && <em className="block text-xs text-gray-400">Reqs: {bookingItem.eventRequirements}</em>}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-sm text-right">
                        {bookingItem.agreedPrice !== null ? 
                          <div className="flex items-center justify-end">
                            <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                            {bookingItem.agreedPrice.toFixed(2)}
                          </div>
                          : '-'}
                      </TableCell>
                      <TableCell className="px-3 py-3">
                        <div className="flex justify-center space-x-2">
                           <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-green-500 text-green-600 hover:bg-green-100 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs px-2.5 py-1.5"
                              onClick={() => handleApprove(bookingItem.id)}
                              disabled={actionLoading[bookingItem.id]}
                            >
                              {actionLoading[bookingItem.id] ? <Clock className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                              Approve
                           </Button>
                           <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-500 text-red-600 hover:bg-red-100 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs px-2.5 py-1.5"
                              onClick={() => handleReject(bookingItem.id)}
                              disabled={actionLoading[bookingItem.id]}
                            >
                              {actionLoading[bookingItem.id] ? <Clock className="h-4 w-4 mr-1 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                              Reject
                           </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <CheckCircle className="h-12 w-12 mb-4 text-green-500" />
              <p className="text-lg font-medium">No pending booking requests.</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TalentBookingsPage; 