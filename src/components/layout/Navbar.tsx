
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    logout();
    toast.success("You have been signed out.");
    navigate("/signin");
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
            <Link to="/" className="text-gray-700 hover:text-rwanda-green font-medium">Home</Link>
            <Link to="/talents" className="text-gray-700 hover:text-rwanda-green font-medium">Browse Talents</Link>
            <Link to="/register" className="text-gray-700 hover:text-rwanda-green font-medium">Become a Talent</Link>
            <Link to="/contact" className="text-gray-700 hover:text-rwanda-green font-medium">Contact</Link>
            <Button className="btn-primary" onClick={handleSignOut}>Sign Out</Button>
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
        <div className="md:hidden bg-white shadow-lg absolute w-full py-2 px-4 z-50 animate-fade-in">
          <div className="space-y-1">
            <Link to="/" className="block py-2 text-gray-700 hover:text-rwanda-green font-medium" onClick={toggleMenu}>Home</Link>
            <Link to="/talents" className="block py-2 text-gray-700 hover:text-rwanda-green font-medium" onClick={toggleMenu}>Browse Talents</Link>
            <Link to="/register" className="block py-2 text-gray-700 hover:text-rwanda-green font-medium" onClick={toggleMenu}>Become a Talent</Link>
            <Link to="/contact" className="block py-2 text-gray-700 hover:text-rwanda-green font-medium" onClick={toggleMenu}>Contact</Link>
            <Button className="btn-primary w-full mt-4" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
