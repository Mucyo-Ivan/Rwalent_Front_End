import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  ChevronDown, 
  User, 
  Settings, 
  LogOut,
  Bell
} from "lucide-react";
import { useNotifications } from '@/contexts/NotificationContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAsRead, clearNotification, clearAll, refresh } = useNotifications();

  const handleSignOut = () => {
    logout();
    toast.success("You have been signed out.");
    navigate("/signin");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-rwanda-green">Rwalent</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/home" className="text-gray-700 hover:text-rwanda-green font-medium">Home</Link>
            <Link to="/talents" className="text-gray-700 hover:text-rwanda-green font-medium">Browse Talents</Link>
            <Link to="/contact" className="text-gray-700 hover:text-rwanda-green font-medium">Contact</Link>
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <Link to="/notifications" className="relative">
                  <Bell className="h-6 w-6 text-gray-700 hover:text-rwanda-green" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 focus:outline-none">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border-2 border-rwanda-green">
                          <span className="text-rwanda-green font-bold text-xl">
                            {userProfile?.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </nav>
          
          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full py-2 px-4 z-50 border-t border-gray-200 animate-fade-in">
          <div className="space-y-1">
            <Link to="/home" className="block py-2.5 text-gray-700 hover:text-rwanda-green font-medium" onClick={toggleMenu}>Home</Link>
            <Link to="/talents" className="block py-2.5 text-gray-700 hover:text-rwanda-green font-medium" onClick={toggleMenu}>Browse Talents</Link>
            <Link to="/contact" className="block py-2.5 text-gray-700 hover:text-rwanda-green font-medium" onClick={toggleMenu}>Contact</Link>
            {isAuthenticated && (
              <>
                <Link to="/profile" className="block py-2.5 text-gray-700 hover:text-rwanda-green font-medium" onClick={toggleMenu}>Profile</Link>
                <Link to="/settings" className="block py-2.5 text-gray-700 hover:text-rwanda-green font-medium" onClick={toggleMenu}>Settings</Link>
                <Link to="/notifications" className="flex items-center py-2.5 text-gray-700 hover:text-rwanda-green font-medium" onClick={toggleMenu}>
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </Link>
                <button
                  onClick={() => { handleSignOut(); toggleMenu(); }}
                  className="block w-full text-left py-2.5 text-red-600 hover:text-red-800 font-medium"
                >
                  <LogOut className="h-5 w-5 mr-2 inline-block" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
