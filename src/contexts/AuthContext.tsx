
import React, { createContext, useState, useContext, useEffect } from "react";

interface UserProfile {
  name: string;
  email: string;
  role: "user" | "talent";
  talentCategory?: string;
  registrationComplete?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  userProfile: UserProfile | null;
  register: (name: string, email: string, password: string, role: "user" | "talent", talentCategory?: string) => Promise<void>;
  getRedirectPath: () => string;
  completeRegistration: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = () => {
      const auth = localStorage.getItem("isAuthenticated");
      
      if (auth === "true") {
        setIsAuthenticated(true);
        
        const storedProfile = localStorage.getItem("userProfile");
        if (storedProfile) {
          try {
            setUserProfile(JSON.parse(storedProfile));
          } catch (e) {
            console.error("Error parsing user profile", e);
          }
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // For demo purposes, we're just setting localStorage
    // In a real app, this would call your API
    localStorage.setItem("isAuthenticated", "true");
    
    // Mock user profile
    const mockProfile: UserProfile = {
      name: email.split('@')[0], // Just use part of the email as name for demo
      email,
      role: "user" // Default role when logging in
    };
    
    localStorage.setItem("userProfile", JSON.stringify(mockProfile));
    setUserProfile(mockProfile);
    setIsAuthenticated(true);
  };

  const register = async (name: string, email: string, password: string, role: "user" | "talent", talentCategory?: string) => {
    // For demo purposes, we're just setting localStorage
    // In a real app, this would call your API to create a user account
    localStorage.setItem("isAuthenticated", "true");
    
    const userProfile: UserProfile = {
      name,
      email,
      role,
      ...(role === "talent" ? { 
        talentCategory,
        registrationComplete: false // New talents need to complete registration
      } : {})
    };
    
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    setUserProfile(userProfile);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userProfile");
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    // For demo purposes, we're just simulating a reset email being sent
    // In a real app, this would call your API to send a reset email
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(`Password reset email sent to: ${email}`);
        resolve();
      }, 1000);
    });
  };

  // Function to determine where to redirect users based on their role
  const getRedirectPath = () => {
    if (!userProfile) return "/";
    
    if (userProfile.role === "talent") {
      // If talent user hasn't completed registration, send to registration page
      if (!userProfile.registrationComplete) {
        return "/register";
      }
      // If registration is complete, send to dashboard
      return "/talent-dashboard";
    }
    
    return "/"; // Redirect regular users to home page
  };

  // Function to mark talent registration as complete
  const completeRegistration = () => {
    if (userProfile && userProfile.role === "talent") {
      const updatedProfile = {
        ...userProfile,
        registrationComplete: true
      };
      setUserProfile(updatedProfile);
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    }
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    resetPassword,
    loading,
    userProfile,
    register,
    getRedirectPath,
    completeRegistration
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
