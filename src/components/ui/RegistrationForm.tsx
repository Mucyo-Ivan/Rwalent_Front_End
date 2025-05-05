
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { completeRegistration } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    location: "",
    bio: "",
    services: "",
    profileImage: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        profileImage: e.target.files![0],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mark registration as complete
      completeRegistration();
      
      setLoading(false);
      toast.success("Registration submitted successfully! We'll review your profile soon.");
      
      // Redirect to talent dashboard after successful registration
      navigate("/talent-dashboard");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm py-2 px-3 bg-white"
            >
              <option value="">Select a category</option>
              <option value="music">Music</option>
              <option value="photography">Photography</option>
              <option value="art">Art</option>
              <option value="dance">Dance</option>
              <option value="events">Events</option>
              <option value="makeup">Makeup</option>
              <option value="tutoring">Tutoring</option>
              <option value="dj">DJ</option>
            </select>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <Input
              id="location"
              name="location"
              type="text"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="City, District"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio/Description *
          </label>
          <Textarea
            id="bio"
            name="bio"
            rows={4}
            required
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell potential clients about yourself, your experience, and skills (150-300 words)"
          />
        </div>

        <div>
          <label htmlFor="services" className="block text-sm font-medium text-gray-700 mb-1">
            Services & Pricing *
          </label>
          <Textarea
            id="services"
            name="services"
            rows={3}
            required
            value={formData.services}
            onChange={handleChange}
            placeholder="List your services and pricing, e.g.: 
1. Wedding Photography - $200
2. Portrait Session - $80"
          />
        </div>

        <div>
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
            Profile Photo *
          </label>
          <Input
            id="profileImage"
            name="profileImage"
            type="file"
            accept="image/*"
            required
            onChange={handleFileChange}
            className="py-1.5"
          />
          <p className="mt-1 text-sm text-gray-500">
            Please upload a clear, professional photo of yourself. Max size: 5MB.
          </p>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="btn-primary w-full py-6" disabled={loading}>
          {loading ? "Submitting..." : "Submit for Review"}
        </Button>
        <p className="mt-4 text-sm text-gray-500 text-center">
          By submitting this form, you agree to our Terms of Service and Privacy Policy.
          We'll review your profile within 48 hours.
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;
