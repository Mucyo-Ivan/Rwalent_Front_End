import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TalentDirectoryPage from "./pages/TalentDirectoryPage";
import TalentProfilePage from "./pages/TalentProfilePage";
import BookingPage from "./pages/BookingPage";
import RegisterTalentPage from "./pages/RegisterTalentPage";
import ContactPage from "./pages/ContactPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import Layout from "./components/layout/Layout";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import CategoryTalentsPage from "./pages/CategoryTalentsPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import BookTalentPage from "./pages/BookTalentPage";
import TalentDashboard from "./pages/TalentDashboard";
import TalentProfile from "./pages/TalentProfile";
import TalentSettings from "./pages/TalentSettings";
import TalentBookingsPage from "./pages/TalentBookingsPage";
import TalentLayout from "./components/layouts/TalentLayout";
import UserNotificationsPage from "./pages/UserNotificationsPage";
import TalentNotificationsPage from "./pages/TalentNotificationsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="rwalent-ui-theme">
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Default redirect to signin */}
              <Route path="/" element={<Navigate to="/signin" replace />} />

              {/* Public auth routes */}
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/register" element={<RegisterTalentPage />} />
              
              {/* Protected routes for regular users */}
              <Route element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="/home" element={<HomePage />} />
                <Route path="/talents" element={<TalentDirectoryPage />} />
                <Route path="/talents/:id" element={<TalentProfilePage />} />
                <Route path="/book/:talentId" element={<BookTalentPage />} />
                <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/category/:category" element={<CategoryTalentsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
                <Route path="/notifications" element={<UserNotificationsPage />} />
              </Route>
              
              {/* Talent Dashboard Routes (Protected implicitly by login flow leading here) */}
              <Route
                path="/talent"
                element={<Navigate to="/talent/dashboard" replace />}
              />
              <Route
                path="/talent/*"
                element={
                  <TalentLayout>
                    <Routes>
                      <Route path="dashboard" element={<TalentDashboard />} />
                      <Route path="profile" element={<TalentProfile />} />
                      <Route path="bookings" element={<TalentBookingsPage />} />
                      <Route path="notifications" element={<TalentNotificationsPage />} />
                      <Route path="settings" element={<TalentSettings />} />
                      <Route path="*" element={<Navigate to="/talent/dashboard" replace />} />
                    </Routes>
                  </TalentLayout>
                }
              />
              
              {/* General Fallback for unauthenticated or unmatched routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
