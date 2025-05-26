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
import { Badge } from "@/components/ui/badge";
import { Camera, Save, X, CalendarPlus, MapPin, User, Phone, Mail, Star } from "lucide-react";
import TalentReviewsSection from "@/components/reviews/TalentReviewsSection";
import { talent } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface TalentProfile {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  category: string;
  location: string;
  bio: string;
  serviceAndPricing: string;
  profileImage: string | null;
  photoUrl: string | null;
  portfolioImages: string[];
  rating?: number;
  reviewCount?: number;
  username?: string;
}

const TalentProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userProfile, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<TalentProfile>({
    id: 0,
    fullName: "",
    email: "",
    phoneNumber: "",
    category: "",
    location: "",
    bio: "",
    serviceAndPricing: "",
    profileImage: null,
    photoUrl: null,
    portfolioImages: [],
    rating: 0,
    reviewCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [talentData, setTalentData] = useState<any>(null);
  const [talentId, setTalentId] = useState<number | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

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
          id: data.id || 0,
          fullName: data.fullName || data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "+250 78 123 4567",
          category: data.category || "Photographer",
          location: data.location || "Kigali, Rwanda",
          bio: data.bio || "Professional with experience in the field.",
          serviceAndPricing: data.serviceAndPricing || "Contact for pricing",
          profileImage: data.profilePicture || null,
          photoUrl: data.photoUrl || null,
          portfolioImages: data.portfolioImages || [],
          rating: data.rating || 0,
          reviewCount: data.reviewCount || 0,
          username: data.username || ""
        });
      } catch (error) {
        console.error('Error fetching talent data:', error);
        toast.error("Could not load talent data");
        navigate('/talents'); // Redirect back to talents list on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchTalentData();
  }, [id, navigate]);

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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col gap-6">
            {/* Header skeleton */}
            <div className="flex justify-between">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>
            
            {/* Profile card skeleton */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-48 w-48 rounded-full" />
                  <Skeleton className="h-10 w-48 mt-4" />
                </div>
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-40" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            </div>
            
            {/* Reviews skeleton */}
            <div className="bg-white rounded-xl shadow p-6">
              <Skeleton className="h-8 w-40 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/talents')}
            className="text-sm flex items-center gap-2"
          >
            ← Back to Talents
          </Button>
        </div>
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Talent Profile</h1>
          <div className="flex gap-2">
            {userProfile?.id === talentData?.id && (
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="border-rwanda-green text-rwanda-green hover:bg-rwanda-green/10"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            )}
            {isEditing && (
              <Button
                onClick={handleSave}
                className="bg-rwanda-green hover:bg-rwanda-green/90 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="xl:col-span-1 overflow-visible">
            <CardHeader className="pb-0">
              <div className="flex justify-center -mt-12">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {profile.photoUrl || profile.profileImage ? (
                      <img
                        src={profile.photoUrl || profile.profileImage}
                        alt={profile.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-rwanda-green/10 text-rwanda-green">
                        <User className="w-16 h-16" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-rwanda-green text-white p-2 rounded-full cursor-pointer shadow-md">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "profile")}
                      />
                    </label>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="text-center pt-3">
              <h2 className="text-2xl font-bold mb-1 text-gray-900">{profile.fullName}</h2>
              
              <div className="mb-3">
                <Badge variant="outline" className="bg-rwanda-green/10 text-rwanda-green border-rwanda-green/20">
                  {profile.category || "Talent"}
                </Badge>
              </div>
              
              <div className="flex justify-center items-center mb-4">
                {talentId && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold">{profile.rating || "New"}</span>
                    <span className="text-gray-500 text-sm">
                      ({profile.reviewCount || 0} {profile.reviewCount === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{profile.location || "Location not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{profile.phoneNumber}</span>
                </div>
              </div>

              {/* Book Talent Button */}
              <Button
                className="w-full bg-rwanda-green hover:bg-rwanda-green/90 flex items-center justify-center gap-2 py-6"
                onClick={() => navigate(`/book/${talentId}`)}
                size="lg"
              >
                <CalendarPlus className="h-5 w-5" />
                Book This Talent
              </Button>
            </CardContent>
          </Card>

          {/* Profile Information Section */}
          <Card className="xl:col-span-2">
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
                <Label htmlFor="serviceAndPricing">Services & Pricing</Label>
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
          <Card className="xl:col-span-3">
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
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
          <Card className="xl:col-span-3">
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
    </div>
  );
};

export default TalentProfilePage;
