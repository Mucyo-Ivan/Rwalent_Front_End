import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/api";

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (email && password) {
        const loginResponse = await auth.login(email, password);
        
        if (loginResponse && loginResponse.token) {
          localStorage.setItem("token", loginResponse.token);
          // Call the context's login function. It might internally fetch the profile
          // or set up the user state based on the token.
          await login(email, password); 
          toast.success("Sign in successful! Verifying user type...");

          // Fetch user profile directly here to determine userType for redirection
          // This ensures immediate redirection logic has the necessary data.
          const userProfileData = await auth.getProfile(); 

          if (userProfileData) {
            // The AuthContext might already have the profile, or will fetch it.
            // If you have a specific setter in AuthContext like `setUserProfile(userProfileData)`, call it here.
            // For now, we'll rely on userProfileData for immediate redirection.
            
            setSuccess("Profile verified! Redirecting...");
            toast.success(`Welcome back, ${userProfileData.fullName || 'user'}!`);

            setTimeout(() => {
              if (userProfileData.userType === "TALENT") {
                navigate("/talent/dashboard");
              } else {
                navigate("/home"); // Redirect to the main homepage for other user types
              }
            }, 1000);
          } else {
            setError("Failed to fetch user profile after login.");
            toast.error("Could not retrieve user details. Please try again.");
            localStorage.removeItem("token"); 
          }
        } else {
           setError("Login failed. No token received.");
           toast.error("Login failed. Please try again.");
        }
      } else {
        setError("Please enter both email and password.");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      const errorMessage = (err instanceof Error && (err as any).response?.data?.message) 
                           ? (err as any).response.data.message 
                           : "Invalid credentials or server error. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rwanda-green">Rwalent</h1>
          <p className="text-gray-600 mt-2">Access Rwanda's Premier Talent Platform</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-rwanda-blue hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-rwanda-green hover:bg-rwanda-green/90"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-rwanda-blue hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
