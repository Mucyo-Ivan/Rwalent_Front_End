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
  User as UserIcon
} from 'lucide-react';
import { toast } from "sonner";
import { auth, Profile } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface UpdateProfilePayload {
  fullName: string;
  email: string; 
  phoneNumber?: string | null; 
  location?: string | null;   
}

const TalentProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [editableProfile, setEditableProfile] = useState<Partial<Profile>>({});
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await auth.getProfile();
      setProfile(data);
      setEditableProfile({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        location: data.location,
        bio: data.bio,
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
      toast.info("New profile picture selected. Ensure you have a separate process to upload it.");
    } else {
      setNewPhotoFile(null);
      setNewPhotoPreview(null);
    }
  };

  const handleSaveChanges = async () => {
    if (!editableProfile || !profile) return;

    if (newPhotoFile) {
      toast.warning("Photo upload needs a separate API endpoint. Uploading text fields only.");
      setNewPhotoFile(null);
      setNewPhotoPreview(null);
    }

    const payload: UpdateProfilePayload = {
      fullName: editableProfile.fullName || profile.fullName,
      email: editableProfile.email || profile.email,
      phoneNumber: editableProfile.phoneNumber,
      location: editableProfile.location,
    };

    setIsSaving(true);
    try {
      const updatedProfileData = await auth.updateProfile(payload);

      setProfile(updatedProfileData); 
      setEditableProfile({
         fullName: updatedProfileData.fullName,
         email: updatedProfileData.email,
         phoneNumber: updatedProfileData.phoneNumber,
         location: updatedProfileData.location,
         bio: updatedProfileData.bio, 
      });

      toast.success("Profile details updated successfully!");

    } catch (error: any) {
      console.error("Failed to update profile:", error);
      const errorMsg = error.response?.data?.detail || error.message || "Please try again.";
      toast.error(`Profile update failed: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
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
                    <AvatarImage src={newPhotoPreview || profile.photoUrl || undefined} alt={profile.fullName || "User Avatar"} />
                    <AvatarFallback>{profile.fullName?.charAt(0).toUpperCase() || 'T'}</AvatarFallback>
                  </Avatar>
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
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{profile.fullName || 'User Name Unavailable'}</h2>
                <p className="text-rwanda-green font-medium">{profile.category || 'Talent'}</p>
              </CardContent>
              
              <div className="border-t px-6 py-4 space-y-3">
                <div className="flex items-start text-sm">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{profile.location || 'N/A'}</span>
                </div>
                <div className="flex items-start text-sm">
                  <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{profile.phoneNumber || 'N/A'}</span>
                </div>
                <div className="flex items-start text-sm">
                  <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 break-all">{profile.email || 'No email available'}</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-50 rounded-t-lg">
                  <TabsTrigger value="profile">Edit Profile</TabsTrigger>
                  <TabsTrigger value="portfolio">Manage Portfolio</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="p-6">
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="fullName" className="font-medium">Full Name</Label>
                        <Input id="fullName" name="fullName" value={editableProfile.fullName || ''} onChange={handleInputChange} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="email" className="font-medium">Email Address</Label>
                        <Input id="email" name="email" type="email" value={editableProfile.email || ''} onChange={handleInputChange} className="mt-1" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="location" className="font-medium">Location</Label>
                      <Input id="location" name="location" value={editableProfile.location || ''} onChange={handleInputChange} placeholder="e.g., Kigali, Rwanda" className="mt-1"/>
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber" className="font-medium">Phone Number</Label>
                      <Input id="phoneNumber" name="phoneNumber" type="tel" value={editableProfile.phoneNumber || ''} onChange={handleInputChange} className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="bio" className="font-medium">Bio</Label>
                      <Textarea id="bio" name="bio" rows={4} value={editableProfile.bio || ''} onChange={handleInputChange} className="mt-1" placeholder="Tell clients about yourself..."></Textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isSaving} className="bg-rwanda-green hover:bg-rwanda-green/90">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="portfolio" className="p-6">
                   <CardTitle>Manage Portfolio</CardTitle>
                   <CardDescription>Upload photos or videos of your work.</CardDescription>
                   <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
                      <p className="text-muted-foreground">Portfolio management feature coming soon.</p>
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