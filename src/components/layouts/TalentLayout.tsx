import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  Settings, 
  Bell, 
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface TalentLayoutProps {
  children: React.ReactNode;
}

const TalentLayout = ({ children }: TalentLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { userProfile } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/talent/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/talent/profile', icon: User },
    { name: 'Bookings', href: '/talent/bookings', icon: Calendar },
    { name: 'Notifications', href: '/talent/notifications', icon: Bell },
    { name: 'Settings', href: '/talent/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    console.log("User logged out");
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-lg`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 border-b border-gray-200 bg-rwanda-green text-white">
            <Link to="/talent/dashboard" className="text-2xl font-bold">
              Talent Portal
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => { if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-150 ease-in-out group ${
                    isActive(item.href)
                      ? 'bg-rwanda-green/10 text-rwanda-green shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive(item.href) ? 'text-rwanda-green' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-200 mt-auto">
            {userProfile ? (
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userProfile.photoUrl || undefined} alt={userProfile.fullName || "User Avatar"} />
                  <AvatarFallback>{userProfile.fullName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate" title={userProfile.fullName}>
                    {userProfile.fullName}
                  </p>
                  <p className="text-xs text-gray-500 truncate" title={userProfile.email}>
                    {userProfile.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            )}
            <Button variant="outline" className="w-full group" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-2 text-gray-500 group-hover:text-rwanda-red" />
              <span className="group-hover:text-rwanda-red">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300 ease-in-out">
        {/* Top Bar for Mobile and Content Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 lg:shadow-none shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>

            {/* Page Title (visible on all screens, adjusted by sidebar) */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-gray-800 truncate">
                {navigation.find((item) => isActive(item.href))?.name || 'Dashboard'}
              </h1>
            </div>

            {/* Right side icons (Bell) */}
            <div className="flex items-center space-x-3">
              <Link to="/talent/notifications">
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default TalentLayout; 