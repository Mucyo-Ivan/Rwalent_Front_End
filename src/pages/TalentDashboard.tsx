import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { dashboardService } from "@/lib/api/dashboard-service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, User, CircleDollarSign, Percent, Settings, Clock, Calendar } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const TalentDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      dashboardService.getTalentDashboardData(),
      dashboardService.getMonthlyBookings(new Date().getFullYear()),
      dashboardService.getEarningsData('month'),
      dashboardService.getProfileStats(),
      dashboardService.getServiceDistribution(),
      dashboardService.getRatingStats()
    ]).then(([
      dashboard,
      monthlyBookings,
      earnings,
      profileStats,
      serviceDistribution,
      ratingStats
    ]) => {
      setData({
        dashboard,
        monthlyBookings,
        earnings,
        profileStats,
        serviceDistribution,
        ratingStats
      });
      setLoading(false);
    }).catch((err) => {
      setError("Failed to load dashboard data. Please try again.");
      setLoading(false);
    });
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
          <Skeleton className="h-8 w-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="h-5 w-[120px]" /></CardHeader><CardContent><Skeleton className="h-8 w-[100px] mb-2" /><Skeleton className="h-4 w-full" /></CardContent></Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card><CardHeader><Skeleton className="h-6 w-[150px]" /></CardHeader><CardContent className="h-[350px] flex items-center justify-center"><Skeleton className="h-full w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-[150px]" /></CardHeader><CardContent className="h-[350px] flex items-center justify-center"><Skeleton className="h-full w-full rounded-full" /></CardContent></Card>
          </div>
        </div>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Talent Dashboard</h1>
          <Button variant="outline" onClick={() => setRefreshKey(k => k + 1)}>Retry</Button>
        </div>
        <Card className="border-red-200"><CardContent className="pt-6"><div className="flex flex-col items-center text-center space-y-4"><h2 className="text-2xl font-bold">Unable to Load Dashboard</h2><p className="text-muted-foreground max-w-md">{error || "There was an error loading your dashboard data. Please try again later."}</p><Button onClick={() => setRefreshKey(k => k + 1)} className="mt-4">Retry</Button></div></CardContent></Card>
      </div>
    );
  }
  const { dashboard, monthlyBookings, earnings, profileStats, serviceDistribution, ratingStats } = data;
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Talent Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here’s your real-time dashboard.</p>
          </div>
          <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setRefreshKey(k => k + 1)} className="flex items-center gap-1">Refresh</Button>
          <Button variant="default" size="sm" onClick={() => navigate('/talent/settings')} className="flex items-center gap-1"><Settings className="h-4 w-4" />Settings</Button>
        </div>
            </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Profile Views</CardTitle><User className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{profileStats?.profileViews ?? 0}</div><p className="text-xs text-muted-foreground">This month</p><Progress value={profileStats?.profileCompletion ?? 0} className="mt-2 h-2" /></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Earnings</CardTitle><CircleDollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">RWF {earnings?.thisMonth?.toLocaleString() ?? 0}</div><p className="text-xs text-muted-foreground">This month</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Rating</CardTitle><Star className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold flex items-center">{ratingStats?.average !== undefined && ratingStats?.average !== null ? ratingStats.average.toFixed(1) : 'N/A'}<span className="text-yellow-400 ml-1 flex"><Star className="h-5 w-5 fill-current" /></span></div><p className="text-xs text-muted-foreground">From {ratingStats?.total ?? 0} reviews</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Profile Completion</CardTitle><Percent className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{profileStats?.profileCompletion ?? 0}%</div><Progress className={`h-2 mt-2 ${(profileStats?.profileCompletion ?? 0) < 70 ? 'bg-amber-500' : 'bg-green-500'}`} value={profileStats?.profileCompletion ?? 0} /></CardContent></Card>
      </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
          <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Bookings (Monthly)</CardTitle></CardHeader><CardContent className="h-[300px]">{monthlyBookings && monthlyBookings.length > 0 ? (<ResponsiveContainer><BarChart data={monthlyBookings}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#047857" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>) : (<div className="flex items-center justify-center h-full"><p className="text-muted-foreground">No booking data available</p></div>)}</CardContent></Card>
          <Card><CardHeader><CardTitle>Service Distribution</CardTitle></CardHeader><CardContent className="h-[300px]">{serviceDistribution && serviceDistribution.length > 0 ? (<ResponsiveContainer><PieChart><Pie data={serviceDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" nameKey="category" dataKey="count" label={({ category, percent }) => `${category} ${((percent || 0) * 100).toFixed(0)}%`} >{serviceDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>) : (<div className="flex items-center justify-center h-full"><p className="text-muted-foreground">No service data available</p></div>)}</CardContent></Card>
          </div>
          <div className="space-y-6">
          <Card><CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader><CardContent className="space-y-4"><Button onClick={() => navigate('/talent/bookings')} className="w-full border border-rwanda-green text-rwanda-green hover:bg-rwanda-green/10" variant="outline"><Calendar className="h-4 w-4 mr-2" />All Bookings</Button></CardContent></Card>
        </div>
      </div>
    </div>
  );
};

export default TalentDashboard;
