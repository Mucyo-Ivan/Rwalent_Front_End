import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const RegisterTalentPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    talentCategory: "",
    phoneNumber: "",
    location: "",
    bio: "",
    serviceAndPricing: "",
  });
  
  useEffect(() => {
    const storedData = localStorage.getItem('talentRegistrationData');
    if (!storedData) {
      navigate("/signup");
      return;
    }
    try {
      const parsedData = JSON.parse(storedData);
      setFormData(prev => ({
        ...prev,
        fullName: parsedData.fullName,
        email: parsedData.email,
        password: parsedData.password,
        talentCategory: parsedData.talentCategory
      }));
    } catch (err) {
      console.error("Error parsing stored data:", err);
      navigate("/signup");
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        userType: 'TALENT',
        phoneNumber: formData.phoneNumber,
        category: formData.talentCategory.toUpperCase(),
        location: formData.location,
        bio: formData.bio,
        serviceAndPricing: formData.serviceAndPricing
      };

      console.log("Sending talent registration request with JSON data:", registrationData);
      const response = await auth.registerTalent(registrationData);
      
      if (response) {
        localStorage.removeItem('talentRegistrationData');
        setSuccess("Talent profile created successfully! Redirecting...");
        toast.success("Welcome to Rwalent! Your talent profile has been created.");
        
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem("isAuthenticated", "true");
          
          const { refreshUserProfile } = useAuth();
          await refreshUserProfile();
        }
        
        setTimeout(() => {
          navigate("/talent/dashboard"); 
        }, 1500);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Failed to create talent profile. Please check your input and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="section-padding bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Complete Your Talent Profile</h1>
          <p className="text-lg text-gray-600">
            Showcase your skills to the world!
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-10">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 border-green-300 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1"
                disabled
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1"
                disabled
              />
              </div>

            <div>
              <Label htmlFor="talentCategory">Talent Category</Label>
              <Input
                id="talentCategory"
                name="talentCategory"
                type="text"
                value={formData.talentCategory}
                onChange={handleInputChange}
                className="mt-1"
                disabled
              />
              </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+250 7XX XXX XXX"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
              </div>

            <div>
              <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="e.g., Kigali, Rwanda"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
              </div>

            <div>
              <Label htmlFor="bio">Bio <span className="text-red-500">*</span></Label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself, your experience, and what makes you unique (max 500 characters)."
                value={formData.bio}
                onChange={(e) => handleInputChange(e as any)}
                className="mt-1 w-full p-2 border rounded-md focus:ring-rwanda-green focus:border-rwanda-green min-h-[100px]"
                rows={4}
                maxLength={500}
                required
              />
            </div>

            <div>
              <Label htmlFor="serviceAndPricing">Services & Pricing <span className="text-red-500">*</span></Label>
              <textarea
                id="serviceAndPricing"
                name="serviceAndPricing"
                placeholder="Describe your services and pricing structure (e.g., Wedding Photography: $500/day, Portrait Sessions: $150/hour)."
                value={formData.serviceAndPricing}
                onChange={(e) => handleInputChange(e as any)}
                className="mt-1 w-full p-2 border rounded-md focus:ring-rwanda-green focus:border-rwanda-green min-h-[100px]"
                rows={4}
                required
              />
          </div>

            <Button
              type="submit"
              className="w-full bg-rwanda-green hover:bg-rwanda-green/90 text-white py-3 text-base font-semibold tracking-wide"
              disabled={loading}
            >
              {loading ? "Creating Profile..." : "Complete Registration & Create Profile"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterTalentPage;
