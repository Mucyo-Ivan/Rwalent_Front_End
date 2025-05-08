import { useState } from "react";
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

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    toast.success("You have been signed out.");
    navigate("/signin");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
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
                <Link 
                  to="/notifications"
                  className="p-2 text-gray-500 hover:text-rwanda-green rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rwanda-green"
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6" />
                </Link>
                <div className="relative">
                  <button
                    onClick={toggleProfile}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border-2 border-rwanda-green">
                        <span className="text-rwanda-green font-bold text-xl">
                          {userProfile?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/edit-profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
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
                <Link to="/edit-profile" className="block py-2.5 text-gray-700 hover:text-rwanda-green font-medium" onClick={toggleMenu}>Edit Profile</Link>
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
