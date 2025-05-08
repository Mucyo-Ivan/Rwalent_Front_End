import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";

const TalentLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    toast.success("You have been signed out.");
    navigate("/signin");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-white shadow-sm"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b">
            <Link to="/talent-dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-rwanda-green">Rwalent</span>
            </Link>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border-2 border-rwanda-green">
                    <span className="text-rwanda-green font-bold text-xl">
                      {userProfile?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-medium">{userProfile?.name}</p>
                <p className="text-sm text-gray-500">Talent</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              to="/talent-dashboard"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-rwanda-green"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/talent-bookings"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-rwanda-green"
            >
              <Calendar className="h-5 w-5" />
              <span>Bookings</span>
            </Link>
            <Link
              to="/talent-profile"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-rwanda-green"
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Link
              to="/talent-settings"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-rwanda-green"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full flex items-center space-x-3 text-gray-700 hover:text-red-600"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TalentLayout; 