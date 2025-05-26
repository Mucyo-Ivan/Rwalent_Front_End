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
import { reviews as reviewsApi } from "@/lib/reviews-api";
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
  const [reviewCount, setReviewCount] = useState(0);
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
    // Fetch real-time review count using the reviews API
    const fetchReviewCount = async (talentId: number) => {
      try {
        // Use the proper reviews API to get the rating summary
        const summary = await reviewsApi.getRatingSummary(talentId);
        const count = summary.totalReviews || 0;
        
        // Update the state with the new count
        setReviewCount(count);
        
        // Update the display in real-time
        const reviewCountElement = document.getElementById('review-count');
        if (reviewCountElement) {
          reviewCountElement.textContent = count.toString();
        }
        
        return count;
      } catch (error) {
        console.error('Error fetching review count:', error);
        return 0;
      }
    };

  const fetchTalentData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Using getById which always provides data (even mock data if real data not found)
        const data = await talent.getById(id);
        setTalentData(data);
        setTalentId(data.id);
        
        // Fetch review count
        const reviewCount = await fetchReviewCount(data.id);
        
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
          reviewCount: reviewCount || data.reviewCount || 0,
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
          {/* Profile Summary Card - More Compact */}
          <Card className="xl:col-span-1 overflow-visible bg-gradient-to-b from-white to-gray-50 border-none shadow-lg">
            <CardHeader className="pb-0 pt-3">
              <div className="flex justify-center -mt-8">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-rwanda-green/20">
                    {/* Always attempt to load the image first and only show fallback if it fails */}
                      <img
                        src={
                          // Use a timestamp to prevent caching if in edit mode
                          profile.photoUrl || profile.profileImage || 
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=0D9488&color=fff&size=150`
                        }
                        alt={profile.fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Handle image load errors by showing a user icon instead of initials
                          e.currentTarget.onerror = null; // Prevent infinite error loop
                          // Replace with user icon instead of initials
                          e.currentTarget.parentElement?.classList.add('bg-rwanda-green/90');
                          e.currentTarget.style.display = 'none';
                          const userIcon = document.createElement('div');
                          userIcon.className = 'w-full h-full flex items-center justify-center text-white';
                          userIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                          e.currentTarget.parentElement?.appendChild(userIcon);
                        }}
                      />
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-rwanda-green text-white p-1 rounded-full cursor-pointer shadow-sm hover:bg-rwanda-green/80 transition-colors">
                      <Camera className="h-3 w-3" />
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

            <CardContent className="text-center pt-2">
              <h2 className="text-xl font-bold mb-1 text-gray-900">
                {profile.fullName}
              </h2>
              
              <div className="mb-2">
                <Badge variant="outline" className="bg-rwanda-green/90 text-white border-none px-3 py-0.5 text-xs font-medium">
                  {profile.category || "Talent"}
                </Badge>
              </div>
              
              <div className="flex justify-center items-center mb-3">
                {talentId && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-3 w-3 ${star <= (profile.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200 fill-gray-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="font-medium text-yellow-700 text-xs">{profile.rating || "New"}</span>
                    <span className="text-gray-500 text-xs">
                      (<span id="review-count">{profile.reviewCount || 0}</span> {profile.reviewCount === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-1 mb-4">
                <div className="flex items-center gap-2 p-1.5 text-sm">
                  <MapPin className="h-3.5 w-3.5 text-rwanda-green" />
                  <span className="text-gray-700">{profile.location || "Location not specified"}</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 text-sm">
                  <Mail className="h-3.5 w-3.5 text-rwanda-green" />
                  <span className="text-gray-700 break-all">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 text-sm">
                  <Phone className="h-3.5 w-3.5 text-rwanda-green" />
                  <span className="text-gray-700">{profile.phoneNumber}</span>
                </div>
              </div>

              {/* Book Talent Button */}
              <div className="mt-3 mx-auto w-full max-w-[95%]">
                <Button
                  className="w-full bg-rwanda-green hover:bg-rwanda-green/90 flex items-center justify-center gap-1 py-2 text-sm"
                  onClick={() => navigate(`/book/${talentId}`)}
                >
                  <CalendarPlus className="h-4 w-4" />
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information Section */}
          <Card className="xl:col-span-2 bg-white border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-rwanda-green/90 to-rwanda-green text-white">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <Label htmlFor="fullName" className="text-rwanda-green font-medium flex items-center gap-1.5">
                    <User className="h-4 w-4" /> Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                    disabled={!isEditing}
                    className="border-rwanda-green/20 focus:border-rwanda-green/50 focus:ring-1 focus:ring-rwanda-green/30 transition-all duration-300 group-hover:shadow-sm"
                  />
                </div>
                <div className="space-y-2 group">
                  <Label htmlFor="email" className="text-rwanda-green font-medium flex items-center gap-1.5">
                    <Mail className="h-4 w-4" /> Email
                  </Label>
                  <Input
                    id="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className="border-rwanda-green/20 focus:border-rwanda-green/50 focus:ring-1 focus:ring-rwanda-green/30 transition-all duration-300 group-hover:shadow-sm"
                  />
                </div>
                <div className="space-y-2 group">
                  <Label htmlFor="phoneNumber" className="text-rwanda-green font-medium flex items-center gap-1.5">
                    <Phone className="h-4 w-4" /> Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={(e) => setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    disabled={!isEditing}
                    className="border-rwanda-green/20 focus:border-rwanda-green/50 focus:ring-1 focus:ring-rwanda-green/30 transition-all duration-300 group-hover:shadow-sm"
                  />
                </div>
                <div className="space-y-2 group">
                  <Label htmlFor="category" className="text-rwanda-green font-medium flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Category
                  </Label>
                  {isEditing ? (
                    <Select
                      value={profile.category || ""}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="border-rwanda-green/20 focus:border-rwanda-green/50 focus:ring-1 focus:ring-rwanda-green/30 transition-all duration-300 group-hover:shadow-sm">
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
                  ) : (
                    <Input
                      id="category"
                      value={profile.category || ""}
                      readOnly
                      className="border-rwanda-green/20"
                    />
                  )}
                </div>
                <div className="space-y-2 group">
                  <Label htmlFor="location" className="text-rwanda-green font-medium flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> Location
                  </Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                    className="border-rwanda-green/20 focus:border-rwanda-green/50 focus:ring-1 focus:ring-rwanda-green/30 transition-all duration-300 group-hover:shadow-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-3 group border border-rwanda-green/10 rounded-xl p-5 bg-rwanda-green/5 hover:bg-rwanda-green/10 transition-all duration-300">
                <Label htmlFor="bio" className="text-rwanda-green font-semibold flex items-center gap-2 text-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
                  Biography
                </Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={5}
                    className="border-rwanda-green/20 focus:border-rwanda-green/50 focus:ring-1 focus:ring-rwanda-green/30 transition-all duration-300 shadow-sm resize-none"
                  />
                ) : (
                  <div className="prose prose-sm max-w-none bg-white p-4 rounded-lg shadow-sm border border-rwanda-green/10">
                    <p className="whitespace-pre-line text-gray-700">{profile.bio}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-3 group border border-rwanda-green/10 rounded-xl p-5 bg-rwanda-green/5 hover:bg-rwanda-green/10 transition-all duration-300">
                <Label htmlFor="serviceAndPricing" className="text-rwanda-green font-semibold flex items-center gap-2 text-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H6"/><path d="M12 18v2"/><path d="M12 6V4"/></svg>
                  Services & Pricing
                </Label>
                {isEditing ? (
                  <Textarea
                    id="serviceAndPricing"
                    value={profile.serviceAndPricing}
                    onChange={(e) => setProfile(prev => ({ ...prev, serviceAndPricing: e.target.value }))}
                    rows={5}
                    className="border-rwanda-green/20 focus:border-rwanda-green/50 focus:ring-1 focus:ring-rwanda-green/30 transition-all duration-300 shadow-sm resize-none"
                  />
                ) : (
                  <div className="prose prose-sm max-w-none bg-white p-4 rounded-lg shadow-sm border border-rwanda-green/10">
                    <p className="whitespace-pre-line text-gray-700">{profile.serviceAndPricing}</p>
                  </div>
                )}
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
