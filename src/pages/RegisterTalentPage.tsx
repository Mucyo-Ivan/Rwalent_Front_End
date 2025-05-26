import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, UploadCloud } from "lucide-react";
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
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!photoFile) {
        setError("Please upload a profile photo.");
        setLoading(false);
        return;
    }

    try {
        // Create FormData to send file and other data
        const talentRegistrationFormData = new FormData();
      talentRegistrationFormData.append('fullName', formData.fullName);
      talentRegistrationFormData.append('email', formData.email);
      talentRegistrationFormData.append('password', formData.password);
      talentRegistrationFormData.append('userType', 'TALENT');
      talentRegistrationFormData.append('phoneNumber', formData.phoneNumber);
      talentRegistrationFormData.append('category', formData.talentCategory.toUpperCase());
      talentRegistrationFormData.append('location', formData.location);
      talentRegistrationFormData.append('bio', formData.bio);
      talentRegistrationFormData.append('serviceAndPricing', formData.serviceAndPricing);
      talentRegistrationFormData.append('photoFile', photoFile);

        console.log("Sending talent registration request with FormData...");
      const response = await auth.registerTalent(talentRegistrationFormData);
      
      if (response) {
        localStorage.removeItem('talentRegistrationData');
        setSuccess("Talent profile created successfully! Redirecting...");
        toast.success("Welcome to Rwalent! Your talent profile has been created.");
        
        // Store the token and set authentication state
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem("isAuthenticated", "true");
          
          // Import the refreshUserProfile function from AuthContext
          const { refreshUserProfile } = useAuth();
          
          // Refresh the user profile to ensure we have the latest data
          await refreshUserProfile();
        }
        
        setTimeout(() => {
          navigate("/talent/dashboard"); 
        }, 1500);
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = (err instanceof Error && (err as any).response?.data?.message) 
                           ? (err as any).response.data.message 
                           : "Failed to create talent profile. Please check your input and try again.";
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

          <form onSubmit={handleSubmit} className="space-y-5">
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
          
          <div>
              <Label htmlFor="photoFile">Profile Photo <span className="text-red-500">*</span></Label>
              <div className="mt-1 flex items-center space-x-4">
                {photoPreview ? (
                    <img src={photoPreview} alt="Photo preview" className="h-20 w-20 rounded-full object-cover" />
                ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <UploadCloud size={32} />
                    </div>
                )}
              <Input
                    id="photoFile"
                    name="photoFile"
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rwanda-green/10 file:text-rwanda-green hover:file:bg-rwanda-green/20 cursor-pointer"
                required
              />
              </div>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB.</p>
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
