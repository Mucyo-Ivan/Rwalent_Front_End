import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Edit2, MapPin, Phone, Mail, User, UserCircle } from "lucide-react";
import { auth, Profile } from "@/lib/api";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ProfilePage = () => {
  const { userProfile } = useAuth(); // userProfile from context might be stale or not the one we want to use here directly for fetching.
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null); // Initialize with null or a default structure

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const profileData = await auth.getProfile();
          console.log('Fetched profile data:', profileData);
          if (profileData) {
            setProfile(profileData);
          }
        } else {
          console.warn("No token found, cannot fetch profile.");
          toast.error("Authentication token not found. Please log in again.");
          navigate("/signin");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile. Please try refreshing or log in again.");
      }
    };
    fetchProfile();
  }, [navigate]);

  if (!profile) {
    return (
        <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
            <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-rwanda-green to-rwanda-blue p-8 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
              <div className="flex flex-col items-center sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-0">
                <div className="relative">
                  <Avatar className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md">
                    <AvatarImage src={profile.photoUrl} alt={profile.fullName || "Profile"} />
                    <AvatarFallback className="text-4xl sm:text-5xl bg-white/30 text-white/70 flex items-center justify-center">
                      {profile.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : <UserCircle className="w-20 h-20" />}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold">{profile.fullName || "Your Name"}</h1>
                  {profile.location && <p className="text-white/90 mt-1 text-sm"><MapPin className="inline h-4 w-4 mr-1"/>{profile.location}</p>}
                  {profile.userType === 'TALENT' && profile.category && (
                    <p className="text-white/80 mt-1 text-xs uppercase tracking-wider font-medium bg-white/20 px-2 py-0.5 rounded-full inline-block">
                      {typeof profile.category === 'string' ? profile.category.replace('_', ' ') : profile.category}
                    </p>
                  )}
                </div>
              </div>
              <Button
                onClick={() => navigate("/edit-profile")}
                variant="outline"
                className="bg-white text-rwanda-green hover:bg-gray-100 border-rwanda-green hover:border-rwanda-green/80 shadow-sm mt-4 sm:mt-0"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information - Removed Card Wrapper */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-5">Contact Information</h3>
                <div className="space-y-5">
                  <div className="flex items-center space-x-3 group py-3 border-b border-gray-100 last:border-b-0">
                    <div className="p-2.5 bg-rwanda-blue/10 rounded-full group-hover:bg-rwanda-blue/20 transition-colors">
                      <UserCircle className="h-5 w-5 text-rwanda-blue" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-700">{profile.fullName || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 group py-3 border-b border-gray-100 last:border-b-0">
                    <div className="p-2.5 bg-rwanda-green/10 rounded-full group-hover:bg-rwanda-green/20 transition-colors">
                      <Mail className="h-5 w-5 text-rwanda-green" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-700">{profile.email || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 