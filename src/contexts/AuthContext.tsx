import React, { createContext, useState, useContext, useEffect } from "react";
import { auth } from "@/lib/api";
import { toast } from "react-hot-toast";

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

  // Function to refresh user profile data from the backend
  const refreshUserProfile = async () => {
    try {
      console.log("[AuthContext] Attempting to refresh user profile...");
      const profile = await auth.getProfile();
      console.log("[AuthContext] Profile fetched successfully:", profile);

      const userProfile: UserProfile = {
        name: profile.fullName || "",
        email: profile.email || "",
        role: profile.userType === "TALENT" ? "talent" : "user",
        userType: profile.userType || "",
        fullName: profile.fullName || "",
        id: profile.id,
        photoUrl: profile.photoUrl || undefined,
        ...(profile.userType === "TALENT" ? { 
          talentCategory: profile.category || undefined,
          registrationComplete: true // Assuming if profile is fetched for talent, registration is complete
        } : {})
      };
      setUserProfile(userProfile);
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      console.log("[AuthContext] User profile set:", userProfile);
    } catch (error) {
      console.error("[AuthContext] Error refreshing user profile:", error);
      // If profile refresh fails, it might mean the token is invalid or expired.
      // Attempt to log out the user.
      logout();
      toast.error("Failed to load user profile. Please sign in again.");
    } finally {
      setLoading(false); // Ensure loading is set to false after profile refresh attempt
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedAuth = localStorage.getItem("isAuthenticated");

    if (token && storedAuth === "true") {
      setIsAuthenticated(true);
      // Only try to refresh profile if not already loading or already fetched
      if (!userProfile) {
        refreshUserProfile();
      }
    } else {
      setIsAuthenticated(false);
      setUserProfile(null);
      setLoading(false);
    }
  }, [isAuthenticated, userProfile]); // Depend on isAuthenticated and userProfile for re-evaluation

  const login = async (email: string, password: string) => {
    try {
      const response = await auth.login(email, password);
      if (response && response.token) {
        console.log('[AuthContext] Token received during login.');
        localStorage.setItem("token", response.token);
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);

        // Fetch user profile immediately after successful login
        await refreshUserProfile();

        // Return the user type for redirection (from backend response)
        return response.userType || response.user_type || "REGULAR_USER";
      }
      throw new Error("Login failed - no token received");
    } catch (error) {
      console.error("[AuthContext] Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: "user" | "talent", talentCategory?: string) => {
    try {
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
          
          await refreshUserProfile();
        }
      } else {
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
      console.error("[AuthContext] Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("[AuthContext] Logging out user.");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("userProfile"); // Clear user profile on logout
    localStorage.removeItem("isAuthenticated"); // Ensure this is also cleared
    setIsAuthenticated(false);
    setUserProfile(null);
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(`[AuthContext] Password reset email simulated for: ${email}`);
        resolve();
      }, 1000);
    });
  };

  const getRedirectPath = () => {
    if (loading) return "/"; // Stay on current page until loading is complete
    if (!isAuthenticated) return "/signin";
    if (!userProfile) return "/"; // Redirect to base if profile is still null after auth
    
    if (userProfile.userType === "TALENT") {
      // For talent, check if registration is complete
      if (userProfile.registrationComplete === false) {
        // If talent registration is not complete, redirect to complete profile page
        return "/register-talent";
      }
      return "/talent/dashboard";
    }
    
    return "/home";
  };

  const completeRegistration = () => {
    if (userProfile && userProfile.role === "talent") {
      const updatedProfile = {
        ...userProfile,
        registrationComplete: true
      };
      setUserProfile(updatedProfile);
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      console.log("[AuthContext] Talent registration marked as complete.");
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
