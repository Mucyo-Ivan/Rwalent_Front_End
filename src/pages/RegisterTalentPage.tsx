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

interface InitialData {
  fullName: string;
  email: string;
  password: string;
  role: string;
  talentCategory: string;
}

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
    photoUrl: ""
  });
  
  useEffect(() => {
    // Get the stored data from localStorage
    const storedData = localStorage.getItem('talentRegistrationData');
    if (!storedData) {
      navigate("/signup");
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      // Pre-fill the form with available data
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const talentData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        userType: "TALENT",
        phoneNumber: formData.phoneNumber,
        category: formData.talentCategory.toUpperCase(),
        location: formData.location,
        bio: formData.bio,
        serviceAndPricing: formData.serviceAndPricing,
        photoUrl: formData.photoUrl
      };

      console.log("Sending talent registration request:", talentData);
      
      // Register the talent with complete information
      await auth.registerTalent(talentData);
      
      // Clear the stored data
      localStorage.removeItem('talentRegistrationData');
      
      setSuccess("Talent profile created successfully! Redirecting...");
      toast.success("Welcome to Rwalent! Your talent profile has been created.");
      
      setTimeout(() => {
      navigate("/talent-dashboard");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to create talent profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="section-padding bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Complete Your Talent Profile</h1>
          <p className="text-lg text-gray-600">
            Add more details about your services and expertise
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                disabled
              />
              </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+250788123456"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="Kigali"
                value={formData.location}
                onChange={handleChange}
                required
              />
              </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                name="bio"
                type="text"
                placeholder="Tell us about yourself and your experience"
                value={formData.bio}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="serviceAndPricing">Services and Pricing</Label>
              <Input
                id="serviceAndPricing"
                name="serviceAndPricing"
                type="text"
                placeholder="Describe your services and pricing structure"
                value={formData.serviceAndPricing}
                onChange={handleChange}
                required
              />
          </div>
          
          <div>
              <Label htmlFor="photoUrl">Profile Photo URL</Label>
              <Input
                id="photoUrl"
                name="photoUrl"
                type="url"
                placeholder="https://example.com/your-photo.jpg"
                value={formData.photoUrl}
                onChange={handleChange}
                required
              />
          </div>

            <Button
              type="submit"
              className="w-full bg-rwanda-green hover:bg-rwanda-green/90"
              disabled={loading}
            >
              {loading ? "Creating profile..." : "Complete Registration"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterTalentPage;
