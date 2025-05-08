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

// Mock data for charts
const bookingData = [
  { month: 'Jan', bookings: 4 },
  { month: 'Feb', bookings: 6 },
  { month: 'Mar', bookings: 8 },
  { month: 'Apr', bookings: 5 },
  { month: 'May', bookings: 7 },
  { month: 'Jun', bookings: 9 },
];

const categoryData = [
  { name: 'Photography', value: 40 },
  { name: 'Videography', value: 30 },
  { name: 'Event Planning', value: 20 },
  { name: 'Music', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TalentDashboard = () => {
  const navigate = useNavigate();
  const [recentBookings, setRecentBookings] = useState([
    {
      id: 1,
      clientName: "John Doe",
      service: "Wedding Photography",
      date: "2024-03-15",
      status: "confirmed",
      amount: 500
    },
    {
      id: 2,
      clientName: "Jane Smith",
      service: "Event Videography",
      date: "2024-03-20",
      status: "pending",
      amount: 750
    },
    // Add more mock bookings as needed
  ]);

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
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
            <Progress value={75} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,500</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
            <Progress value={60} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Rating</CardTitle>
            <Star className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-muted-foreground">Based on 120 reviews</p>
            <Progress value={90} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <User className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 new this month</p>
            <Progress value={40} className="mt-2 h-2" />
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
                <BarChart data={bookingData}>
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
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
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
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentBookings.length > 0 ? recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div>
                    <p className="font-semibold text-sm">{booking.clientName}</p>
                    <p className="text-xs text-gray-500">{booking.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">${booking.amount}</p>
                    <Badge 
                      variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'secondary' : 'outline'}
                      className={`mt-1 text-xs px-2 py-0.5 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-500 text-center py-4">No recent bookings.</p>}
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