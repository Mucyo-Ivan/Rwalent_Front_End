import { useState, useEffect, useRef } from "react";
// import { useAuth } from "@/contexts/AuthContext"; // Removed if context updateProfile is not used
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Camera, Save, ArrowLeft, UserCircle, User, Mail, Phone, MapPin, Briefcase, DollarSign, AlertCircle } from "lucide-react"; // Added AlertCircle
import { auth, Profile } from "@/lib/api"; // Ensure Profile is imported
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert"; // Import Alert components

// Default empty profile structure matching the Profile interface
const defaultProfile: Profile = {
  id: 0,
  fullName: "",
  email: "",
  phoneNumber: "",
  userType: "",
  category: "",
  location: "",
  bio: "",
  serviceAndPricing: "",
  photoUrl: "",
  enabled: false,
  username: "",
  authorities: [],
  accountNonExpired: false,
  credentialsNonExpired: false,
  accountNonLocked: false,
};

const EditProfilePage = () => {
  // const { userProfile, updateProfile: updateProfileContext } = useAuth(); // Removed context usage for now
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State to hold the profile data being edited, typed with Profile
  const [editableProfile, setEditableProfile] = useState<Profile>(defaultProfile);
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchInitialProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProfileData = await auth.getProfile();
        if (fetchedProfileData) {
          setEditableProfile(fetchedProfileData);
          setNewPhotoPreview(fetchedProfileData.photoUrl); // Use photoUrl for preview
        } else {
          throw new Error("Profile data not found.");
        }
      } catch (err) {
        console.error("Failed to fetch profile for editing:", err);
        setError("Failed to load profile data. Please try again.");
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialProfile();
  }, []); 

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableProfile(prev => ({
      ...prev!, 
      [name]: value
    }));
  };

  // Trigger file input
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection and preview
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } 
  };

  // --- Updated handleSave to send specific JSON payload ---
  const handleSave = async () => {
    setSaving(true);
    setError(null);

    // 1. Create the specific JSON payload object
    const profileUpdatePayload = {
      fullName: editableProfile.fullName,
      email: editableProfile.email, // Assuming email *can* be sent, even if not changed (backend might ignore or validate)
      phoneNumber: editableProfile.phoneNumber || null, // Send null if empty, matching example
      location: editableProfile.location || null    // Send null if empty, matching example
    };

    // --- Photo Upload Logic (Separate Step) ---
    // We will handle photo upload separately if a new photo was selected.
    // For now, we focus only on updating the text fields via JSON.
    let photoUpdateSuccess = true; // Assume true if no new photo
    if (newPhotoFile) {
        console.warn("New photo selected, but photo upload needs a separate API call. Saving text data only for now.");
        toast.info("Profile text data saved. Photo upload needs separate implementation.");
        // TODO: Implement separate call to a photo upload endpoint here
        // Example: 
        // try {
        //   const photoFormData = new FormData();
        //   photoFormData.append('photoFile', newPhotoFile, newPhotoFile.name);
        //   await auth.uploadProfilePhoto(photoFormData); // Assumes a new function in api.ts
        //   photoUpdateSuccess = true;
        //   setNewPhotoFile(null); // Clear file only on successful upload
        // } catch (photoError) {
        //   console.error("Failed to upload photo:", photoError);
        //   toast.error("Failed to upload profile picture. Other details might be saved.");
        //   photoUpdateSuccess = false; 
        //   // Decide if you want to stop saving text data if photo fails
        //   // setError("Failed to upload photo. Profile not fully updated.");
        //   // setSaving(false);
        //   // return; 
        // }
    }
    // --- End Photo Upload Logic ---

    try {
      console.log("Sending JSON to updateProfile:", profileUpdatePayload);
      
      // 2. Call auth.updateProfile with the JSON object
      const updatedProfile = await auth.updateProfile(profileUpdatePayload);
      
      console.log("Received updated profile:", updatedProfile);

      // 3. Update state with response
      setEditableProfile(updatedProfile);
      // Update preview only if photo wasn't handled separately or if backend confirms URL
      if (photoUpdateSuccess) { // Only update preview if photo logic didn't fail (or wasn't attempted)
          setNewPhotoPreview(updatedProfile.photoUrl); 
      } else {
          // Keep existing preview if photo failed but text succeeded?
          // Or maybe revert to original photoUrl from updatedProfile?
          setNewPhotoPreview(updatedProfile.photoUrl); // Default: use URL from backend anyway
      }
      
      toast.success("Profile details updated successfully!");
      navigate("/profile");

    } catch (err) {
      console.error("Failed to update profile text data:", err);
      const errorMessage = (err instanceof Error && (err as any).response?.data?.message) 
                           ? (err as any).response.data.message 
                           : "Failed to save profile details. Please check your input and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Render Logic
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading editor...</p>
      </div>
    );
  }

  if (error && !loading) { // Show error only if not loading
     return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center px-4">
         <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error} <Button variant="link" onClick={() => navigate('/profile')}>Go Back</Button></AlertDescription>
         </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-rwanda-green to-rwanda-blue p-6 sm:p-8 text-white">
             {/* ... Header content (unchanged) ... */}
             <div className="flex justify-between items-center">
               <div className="flex items-center space-x-3">
                 <Button
                   variant="ghost"
                   size="icon"
                   className="text-white hover:bg-white/10 rounded-full"
                   onClick={() => navigate("/profile")}
                 >
                   <ArrowLeft className="h-5 w-5" />
                 </Button>
                 <h1 className="text-2xl sm:text-3xl font-bold">Edit Profile</h1>
               </div>
               <Button
                 onClick={handleSave}
                 disabled={saving}
                 className="bg-white text-rwanda-green hover:bg-gray-100 shadow-sm"
               >
                 {saving ? (
                    <>
                     <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-rwanda-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Saving...
                   </>
                 ) : (
                   <>
                     <Save className="h-4 w-4 mr-2" />
                     Save Changes
                   </>
                 )}
               </Button>
             </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Display general error message if save failed */}
            {error && saving === false && (
                 <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                 </Alert>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Image Section */} 
              <div className="md:col-span-1 flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Profile Picture</h3>
                  <div className="relative group">
                    <Avatar className="w-32 h-32 cursor-pointer ring-2 ring-primary/50 group-hover:ring-primary transition-all duration-300">
                      <AvatarImage src={newPhotoPreview || editableProfile.photoUrl} alt={editableProfile.fullName || "User"} />
                      <AvatarFallback className="text-3xl">
                        {editableProfile.fullName ? editableProfile.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : <UserCircle className="w-16 h-16 text-muted-foreground" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300 cursor-pointer" onClick={() => document.getElementById('photoInput')?.click()}>
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <Input type="file" id="photoInput" accept="image/*" onChange={handlePhotoFileChange} className="hidden" />
              </div>

              {/* Profile Information Section */} 
              <div className="md:col-span-2 space-y-6">
                 {/* Cards remain the same, ensure they use editableProfile state */}
                 <Card className="border rounded-lg shadow-sm">
                    {/* ... Basic Information Card using editableProfile and handleInputChange ... */} 
                    <CardHeader>
                        <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-1.5">
                            <Label htmlFor="fullName" className="flex items-center text-sm font-medium text-gray-700">
                              <User className="h-4 w-4 mr-2 text-gray-400" />Full Name
                            </Label>
                            <Input
                              id="fullName"
                              name="fullName"
                              value={editableProfile.fullName || ''}
                              onChange={handleInputChange}
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />Email Address
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={editableProfile.email || ''}
                              placeholder="your.email@example.com"
                              disabled 
                            />
                             <p className="text-xs text-gray-500">Email address cannot be changed.</p>
                          </div>
                    </CardContent>
                 </Card>
                 
                 

                 {/* Talent Specific Fields */} 
                 {editableProfile.userType === 'TALENT' && (
                    <Card className="border rounded-lg shadow-sm">
                        {/* ... Talent Details Card using editableProfile and handleInputChange ... */} 
                         <CardHeader>
                             <CardTitle className="text-lg">Talent Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-1.5">
                                <Label htmlFor="category" className="flex items-center text-sm font-medium text-gray-700">
                                  <Briefcase className="h-4 w-4 mr-2 text-gray-400" />Talent Category
                                </Label>
                                <Input
                                  id="category"
                                  name="category"
                                  value={editableProfile.category || ''}
                                  placeholder="e.g., MUSICIAN, PHOTOGRAPHER"
                                  disabled 
                                />
                             </div>
                             <div className="space-y-1.5">
                                <Label htmlFor="serviceAndPricing" className="flex items-center text-sm font-medium text-gray-700">
                                  <DollarSign className="h-4 w-4 mr-2 text-gray-400" />Services & Pricing
                                </Label>
                                <Textarea
                                  id="serviceAndPricing"
                                  name="serviceAndPricing"
                                  value={editableProfile.serviceAndPricing || ''}
                                  onChange={handleInputChange}
                                  placeholder="Describe your services and pricing (e.g., Service A: $X/hr)"
                                  rows={4}
                                  className="min-h-[100px]"
                                />
                             </div>
                        </CardContent>
                    </Card>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage; 