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
import TalentDashboardPage from "./pages/TalentDashboardPage";
import Layout from "./components/layout/Layout";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import CategoryTalentsPage from "./pages/CategoryTalentsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public auth routes */}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/register" element={<RegisterTalentPage />} />
            
            {/* Protected routes */}
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<HomePage />} />
              <Route path="/talents" element={<TalentDirectoryPage />} />
              <Route path="/talents/:id" element={<TalentProfilePage />} />
              <Route path="/booking/:id" element={<BookingPage />} />
              <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />
              <Route path="/talent-dashboard" element={<TalentDashboardPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/category/:category" element={<CategoryTalentsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
