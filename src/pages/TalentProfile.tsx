import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Instagram, 
  Twitter, 
  Linkedin,
  Award,
  Star,
  Clock,
  Edit3,
  AlertCircle,
  User as UserIcon,
  Save,
  X
} from 'lucide-react';
import { toast } from "sonner";
import { auth, Profile } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { uploadService } from "@/lib/upload-service";

interface UpdateProfilePayload {
  fullName: string;
  email: string; 
  phoneNumber?: string | null; 
  location?: string | null;   
  bio?: string | null;
  serviceAndPricing?: string | null;
  category?: string | null;
}

const TalentProfile = () => {
  const navigate = useNavigate();
  const { userProfile, refreshUserProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [editableProfile, setEditableProfile] = useState<Partial<Profile>>({});
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await auth.getProfile();
      setProfile(data);
      setEditableProfile({
        fullName: data.fullName || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        location: data.location || '',
        bio: data.bio || '',
        serviceAndPricing: data.serviceAndPricing || '',
        category: data.category || '',
      });
    } catch (err) {
      console.error("Failed to fetch talent profile:", err);
      setError("Could not load profile data. Please try refreshing.");
      toast.error("Failed to load profile data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setNewPhotoFile(null);
      setNewPhotoPreview(null);
    }
  };

  const handleSaveChanges = async () => {
    if (!editableProfile || !profile) return;

    setIsSaving(true);
    try {
      // Prepare the profile data
      const profileUpdateData: UpdateProfilePayload & { photoUrl?: string } = {
        fullName: editableProfile.fullName || profile.fullName,
        email: editableProfile.email || profile.email,
        phoneNumber: editableProfile.phoneNumber || '',
        location: editableProfile.location || '',
        bio: editableProfile.bio || '',
        serviceAndPricing: editableProfile.serviceAndPricing || '',
        category: editableProfile.category || ''
      };
      
      if (newPhotoFile) {
        // If there's a new photo, use the updated approach
        // First, upload just the profile picture file
        try {
          const uploadResult = await uploadService.uploadProfilePicture(newPhotoFile);
          // Add the photo URL to the profile data
          profileUpdateData.photoUrl = uploadResult;
          console.log('Profile picture uploaded successfully:', uploadResult);
        } catch (uploadError) {
          console.error('Failed to upload profile picture:', uploadError);
          toast.error('Failed to upload profile picture, but will continue updating profile info');
          // Continue with the update even if the picture upload fails
        }
      }
      
      // Now update the profile with the new data (including photo URL if successful)
      const updatedProfileData = await auth.updateProfile(profileUpdateData);

      setProfile(updatedProfileData);
      setEditableProfile({
        fullName: updatedProfileData.fullName || '',
        email: updatedProfileData.email || '',
        phoneNumber: updatedProfileData.phoneNumber || '',
        location: updatedProfileData.location || '',
        bio: updatedProfileData.bio || '',
        serviceAndPricing: updatedProfileData.serviceAndPricing || '',
        category: updatedProfileData.category || '',
      });

      // Update the global user profile
      if (refreshUserProfile) {
        refreshUserProfile();
      }

      // Clear the photo file states
      setNewPhotoFile(null);
      setNewPhotoPreview(null);
      setIsEditing(false);

      toast.success("Profile details updated successfully!");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      const errorMsg = error.response?.data?.detail || error.message || "Please try again.";
      toast.error(`Profile update failed: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditableProfile({
      fullName: profile?.fullName || '',
      email: profile?.email || '',
      phoneNumber: profile?.phoneNumber || '',
      location: profile?.location || '',
      bio: profile?.bio || '',
      serviceAndPricing: profile?.serviceAndPricing || '',
      category: profile?.category || '',
    });
    setNewPhotoFile(null);
    setNewPhotoPreview(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg"><CardContent className="pt-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
          <Card className="shadow-lg"><CardContent className="pt-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="shadow-lg"><CardContent className="pt-6"><Skeleton className="h-96 w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4">
         <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Profile</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button onClick={() => fetchProfileData()} variant="secondary" className="mt-4">Retry</Button>
         </Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <UserIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Profile data could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-1">
            <Card className="shadow-lg">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="h-36 w-36 border-4 border-white shadow-md">
                    <AvatarImage src={newPhotoPreview || profile?.photoUrl || undefined} alt={profile?.fullName || "User Avatar"} />
                    <AvatarFallback>{profile?.fullName?.charAt(0).toUpperCase() || 'T'}</AvatarFallback>
                  </Avatar>
                {isEditing && (
                  <>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoFileChange}
                    accept="image/png, image/jpeg, image/gif"
                    className="hidden"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleAvatarClick}
                    className="absolute bottom-2 right-2 rounded-full bg-white hover:bg-gray-100 shadow"
                    aria-label="Change profile picture"
                  >
                    <Camera className="h-5 w-5 text-gray-600" />
                  </Button>
                  </>
                )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{profile?.fullName || 'User Name Unavailable'}</h2>
                <p className="text-rwanda-green font-medium">{profile?.category || 'Talent'}</p>
              </CardContent>
              
              <div className="border-t px-6 py-4 space-y-3">
                <div className="flex items-start text-sm">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{profile?.location || 'N/A'}</span>
                </div>
                <div className="flex items-start text-sm">
                  <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{profile?.phoneNumber || 'N/A'}</span>
                </div>
                <div className="flex items-start text-sm">
                  <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 break-all">{profile?.email || 'No email available'}</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-50 rounded-t-lg">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="services">Services & Pricing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Profile Information</h3>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleCancelEdit} variant="outline" className="flex items-center">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSaveChanges} disabled={isSaving} className="flex items-center bg-rwanda-green hover:bg-rwanda-green/90">
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="fullName" className="font-medium">Full Name</Label>
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        value={editableProfile.fullName || ''} 
                        onChange={handleInputChange} 
                        className="mt-1"
                        disabled={!isEditing}
                      />
                      </div>
                      <div>
                        <Label htmlFor="email" className="font-medium">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={editableProfile.email || ''} 
                        onChange={handleInputChange} 
                        className="mt-1"
                        disabled={!isEditing}
                      />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="location" className="font-medium">Location</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      value={editableProfile.location || ''} 
                      onChange={handleInputChange} 
                      placeholder="e.g., Kigali, Rwanda" 
                      className="mt-1"
                      disabled={!isEditing}
                    />
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber" className="font-medium">Phone Number</Label>
                    <Input 
                      id="phoneNumber" 
                      name="phoneNumber" 
                      type="tel" 
                      value={editableProfile.phoneNumber || ''} 
                      onChange={handleInputChange} 
                      className="mt-1"
                      disabled={!isEditing}
                    />
                    </div>

                    <div>
                      <Label htmlFor="bio" className="font-medium">Bio</Label>
                    <Textarea 
                      id="bio" 
                      name="bio" 
                      rows={4} 
                      value={editableProfile.bio || ''} 
                      onChange={handleInputChange} 
                      className="mt-1" 
                      placeholder="Tell clients about yourself..."
                      disabled={!isEditing}
                    />
                    </div>
                </form>
              </TabsContent>

              <TabsContent value="services" className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Services & Pricing</h3>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Services
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleCancelEdit} variant="outline" className="flex items-center">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSaveChanges} disabled={isSaving} className="flex items-center bg-rwanda-green hover:bg-rwanda-green/90">
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="category" className="font-medium">Category</Label>
                    <Input 
                      id="category" 
                      name="category" 
                      value={editableProfile.category || ''} 
                      onChange={handleInputChange} 
                      className="mt-1"
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceAndPricing" className="font-medium">Services & Pricing</Label>
                    <Textarea 
                      id="serviceAndPricing" 
                      name="serviceAndPricing" 
                      rows={6} 
                      value={editableProfile.serviceAndPricing || ''} 
                      onChange={handleInputChange} 
                      className="mt-1" 
                      placeholder="Describe your services and pricing..."
                      disabled={!isEditing}
                    />
                  </div>
                   </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
    </div>
  );
};

export default TalentProfile; 