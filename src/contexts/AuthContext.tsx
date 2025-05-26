import React, { createContext, useState, useContext, useEffect } from "react";
import { auth } from "@/lib/api";

interface UserProfile {
  name: string;
  email: string;
  role: "user" | "talent";
  talentCategory?: string;
  registrationComplete?: boolean;
  userType: string;
  fullName?: string;
  id?: number;
  photoUrl?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  userProfile: UserProfile | null;
  register: (name: string, email: string, password: string, role: "user" | "talent", talentCategory?: string) => Promise<void>;
  getRedirectPath: () => string;
  completeRegistration: () => void;
  refreshUserProfile: () => Promise<void>;
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

  const refreshUserProfile = async () => {
    try {
      const profile = await auth.getProfile();
      const userProfile: UserProfile = {
        name: profile.fullName,
        email: profile.email,
        role: profile.userType === "TALENT" ? "talent" : "user",
        userType: profile.userType,
        fullName: profile.fullName,
        id: profile.id,
        photoUrl: profile.photoUrl,
        ...(profile.userType === "TALENT" ? { 
          talentCategory: profile.category,
          registrationComplete: true
        } : {})
      };
      setUserProfile(userProfile);
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
    } catch (error) {
      console.error("Error refreshing user profile:", error);
      // If profile refresh fails, log out the user
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await auth.login(email, password);
      if (response && response.token) {
        console.log('Token received:', response.token);
        localStorage.setItem("token", response.token);
        setIsAuthenticated(true);
    
        // Fetch user profile to determine user type
        await refreshUserProfile();
        
        // Return the user type for redirection
        return response.userType || "REGULAR_USER";
      }
      throw new Error("Login failed - no token received");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: "user" | "talent", talentCategory?: string) => {
    try {
      // Call the backend API to register the user
      if (role === "user") {
        const response = await auth.registerRegular({
          fullName: name,
          email,
          password,
          userType: "REGULAR_USER"
        });
        
        if (response && response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("isAuthenticated", "true");
          setIsAuthenticated(true);
          
          // Fetch user profile after registration
          await refreshUserProfile();
        }
      } else {
        // For talents, we just store basic info initially
        // The actual registration happens in the RegisterTalentPage component
        const userProfile: UserProfile = {
          name,
          email,
          role,
          talentCategory,
          registrationComplete: false,
          userType: "TALENT"
        };
        
        localStorage.setItem("userProfile", JSON.stringify(userProfile));
        setUserProfile(userProfile);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
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
    
    if (userProfile.userType === "TALENT") {
      return "/talent/dashboard";
    }
    
    return "/home"; // Redirect regular users to home page
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
    completeRegistration,
    refreshUserProfile
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
