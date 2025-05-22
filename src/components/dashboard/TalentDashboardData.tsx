import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

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
}

export const TalentDashboardData: React.FC = () => {
  const { userProfile } = useAuth();
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
    if (userProfile?.userType === 'TALENT') {
      fetchDashboardData();
    }
  }, [userProfile]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-rwanda-green text-white rounded hover:bg-rwanda-green/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
          <p className="text-3xl font-bold text-rwanda-green">{data.totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pending Bookings</h3>
          <p className="text-3xl font-bold text-yellow-500">{data.pendingBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Completed Bookings</h3>
          <p className="text-3xl font-bold text-blue-500">{data.completedBookings}</p>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Earnings Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600">Total Earnings</p>
            <p className="text-2xl font-bold text-rwanda-green">RWF {data.earnings.total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-blue-500">RWF {data.earnings.thisMonth.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Last Month</p>
            <p className="text-2xl font-bold text-gray-500">RWF {data.earnings.lastMonth.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Upcoming Bookings</h3>
        <div className="space-y-4">
          {data.upcomingBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border rounded">
              <div>
                <p className="font-medium">{booking.clientName}</p>
                <p className="text-sm text-gray-600">{new Date(booking.date).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Recent Reviews</h3>
        <div className="space-y-4">
          {data.recentReviews.map((review) => (
            <div key={review.id} className="p-4 border rounded">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{review.clientName}</p>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{review.rating}/5</span>
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
              <p className="text-sm text-gray-500 mt-2">{new Date(review.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 