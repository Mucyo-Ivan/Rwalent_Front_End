import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Camera, Save, X, CalendarPlus } from "lucide-react";
import TalentReviewsSection from "@/components/reviews/TalentReviewsSection";
import { talent } from "@/lib/api";
import EnhancedAvatar from "@/components/ui/EnhancedAvatar";

interface TalentProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  category: string;
  location: string;
  bio: string;
  serviceAndPricing: string;
  profileImage: string | null;
  portfolioImages: string[];
}

const TalentProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<TalentProfile>({
    fullName: "",
    email: "",
    phoneNumber: "",
    category: "",
    location: "",
    bio: "",
    serviceAndPricing: "",
    profileImage: null,
    portfolioImages: []
  });
  const [loading, setLoading] = useState(true);
  const [talentData, setTalentData] = useState<any>(null);
  const [talentId, setTalentId] = useState<number | null>(null);

  // Fetch talent data
  useEffect(() => {
    const fetchTalentData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Using getById which always provides data (even mock data if real data not found)
        const data = await talent.getById(id);
        setTalentData(data);
        setTalentId(data.id);
        
        // Update profile with talent data
        setProfile({
          fullName: data.fullName || data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "+250 78 123 4567",
          category: data.category || "Photographer",
          location: data.location || "Kigali, Rwanda",
          bio: data.bio || "Professional with experience in the field.",
          serviceAndPricing: data.serviceAndPricing || "Contact for pricing",
          profileImage: data.photoUrl || null,
          portfolioImages: data.portfolioImages || []
        });
      } catch (error) {
        console.error('Error fetching talent data:', error);
        toast.error("Could not load talent data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTalentData();
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "portfolio") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "profile") {
          setProfile(prev => ({ ...prev, profileImage: reader.result as string }));
        } else {
          setProfile(prev => ({
            ...prev,
            portfolioImages: [...prev.portfolioImages, reader.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, this would save the profile to the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rwanda-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{profile.fullName}</h1>
        <div className="flex gap-3">
          {userProfile?.id !== talentId && (
            <Button
              onClick={() => navigate(`/book/${talentId}`)}
              className="bg-rwanda-green hover:bg-rwanda-green/90 text-white"
            >
              <CalendarPlus className="h-4 w-4 mr-2" />
              Book Now
            </Button>
          )}
          {userProfile?.id === talentId && (
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "default" : "outline"}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                "Edit Profile"
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Image Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="relative w-48 h-48">
                  <EnhancedAvatar
                    user={{
                      id: talentId || undefined,
                      fullName: profile.fullName,
                      photoUrl: profile.profileImage
                    }}
                    size="xl"
                    className="w-48 h-48 shadow-lg"
                    fallbackClassName="bg-rwanda-green text-white text-5xl"
                  />
                </div>

                {isEditing && (
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 p-2 bg-rwanda-green text-white rounded-full cursor-pointer hover:bg-rwanda-green/90 transition-colors"
                  >
                    <Camera className="h-5 w-5" />
                    <input
                      type="file"
                      id="profileImage"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "profile")}
                    />
                  </label>
                )}
              </div>
              {isEditing && (
                <p className="text-sm text-gray-500 text-center">
                  Click the camera icon to change your profile picture
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={(e) => setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={profile.category}
                  onValueChange={(value) => setProfile(prev => ({ ...prev, category: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Photographer">Photographer</SelectItem>
                    <SelectItem value="Videographer">Videographer</SelectItem>
                    <SelectItem value="DJ">DJ</SelectItem>
                    <SelectItem value="Musician">Musician</SelectItem>
                    <SelectItem value="Event Planner">Event Planner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                disabled={!isEditing}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceAndPricing">Services and Pricing</Label>
              <Textarea
                id="serviceAndPricing"
                value={profile.serviceAndPricing}
                onChange={(e) => setProfile(prev => ({ ...prev, serviceAndPricing: e.target.value }))}
                disabled={!isEditing}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Section */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Portfolio Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profile.portfolioImages.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {isEditing && (
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      onClick={() => setProfile(prev => ({
                        ...prev,
                        portfolioImages: prev.portfolioImages.filter((_, i) => i !== index)
                      }))}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                  <div className="text-center">
                    <Camera className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Add Image</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "portfolio")}
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Reviews & Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            {talentId && (
              <TalentReviewsSection 
                talentId={talentId} 
                talentName={profile.fullName} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TalentProfilePage;
