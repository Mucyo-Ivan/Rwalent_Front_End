import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Lock, 
  Mail, 
  Globe, 
  Moon, 
  Sun, 
  Shield, 
  CreditCard,
  Save,
  X,
  User,
  Smartphone,
  MapPin,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { auth } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/contexts/ThemeContext";

interface UserSettings {
  email: string;
  phoneNumber: string;
  location: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: boolean;
    showLocation: boolean;
    showPhone: boolean;
    showEmail: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
  };
  billing: {
    cardOnFile: boolean;
    autoRenew: boolean;
  };
}

const UserSettings = () => {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // This would be replaced with your actual API call
      const data = await auth.getUserSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to fetch user settings:", err);
      setError("Could not load settings. Please try refreshing.");
      toast.error("Failed to load settings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleNotificationToggle = (type: keyof UserSettings['notifications']) => {
    if (!settings) return;
    setSettings(prev => ({
      ...prev!,
      notifications: {
        ...prev!.notifications,
        [type]: !prev!.notifications[type]
      }
    }));
  };

  const handlePrivacyToggle = (type: keyof UserSettings['privacy']) => {
    if (!settings) return;
    setSettings(prev => ({
      ...prev!,
      privacy: {
        ...prev!.privacy,
        [type]: !prev!.privacy[type]
      }
    }));
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      // This would be replaced with your actual API call
      await auth.updateUserSettings(settings);
      toast.success("Settings updated successfully!");
    } catch (error: any) {
      console.error("Failed to update settings:", error);
      toast.error("Failed to update settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setIsSaving(true);
    try {
      // This would be replaced with your actual API call
      await auth.changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully!");
    }, 1200);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Settings</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button onClick={fetchSettings} variant="secondary" className="mt-4">
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Settings</h1>
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2">
          <TabsTrigger value="notifications" className="flex-col sm:flex-row h-auto sm:h-10 py-2 sm:py-0">
            <Bell className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2 text-blue-500" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex-col sm:flex-row h-auto sm:h-10 py-2 sm:py-0">
            <Shield className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2 text-green-600" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex-col sm:flex-row h-auto sm:h-10 py-2 sm:py-0">
            <CreditCard className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2 text-purple-600" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex-col sm:flex-row h-auto sm:h-10 py-2 sm:py-0">
            <Sun className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2 text-yellow-500" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-blue-600"><Bell className="h-5 w-5" /> Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive important updates via email.</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleNotificationToggle('email')}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                <div>
                  <h3 className="font-medium">SMS Notifications</h3>
                  <p className="text-sm text-gray-500">Get critical alerts via SMS (charges may apply).</p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={settings.notifications.sms}
                  onCheckedChange={(checked) => handleNotificationToggle('sms')}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive real-time updates on your device.</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => handleNotificationToggle('push')}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                <div>
                  <h3 className="font-medium">Marketing Emails</h3>
                  <p className="text-sm text-gray-500">Receive news, offers, and promotions.</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={settings.notifications.marketing}
                  onCheckedChange={(checked) => handleNotificationToggle('marketing')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-green-700"><Shield className="h-5 w-5" /> Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-green-50 transition-colors">
                <div>
                  <h3 className="font-medium">Profile Visibility</h3>
                  <p className="text-sm text-gray-500">Control who can see your profile.</p>
                </div>
                <Switch
                  id="profile-visibility"
                  checked={settings.privacy.profileVisibility}
                  onCheckedChange={(checked) => handlePrivacyToggle('profileVisibility')}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-green-50 transition-colors">
                <div>
                  <h3 className="font-medium">Show Location</h3>
                  <p className="text-sm text-gray-500">Display your location on your profile.</p>
                </div>
                <Switch
                  id="show-location"
                  checked={settings.privacy.showLocation}
                  onCheckedChange={(checked) => handlePrivacyToggle('showLocation')}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-green-50 transition-colors">
                <div>
                  <h3 className="font-medium">Show Email</h3>
                  <p className="text-sm text-gray-500">Display your email on your profile.</p>
                </div>
                <Switch
                  id="show-email"
                  checked={settings.privacy.showEmail}
                  onCheckedChange={(checked) => handlePrivacyToggle('showEmail')}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-green-50 transition-colors">
                <div>
                  <h3 className="font-medium">Show Phone Number</h3>
                  <p className="text-sm text-gray-500">Display your phone number on your profile.</p>
                </div>
                <Switch
                  id="show-phone"
                  checked={settings.privacy.showPhone}
                  onCheckedChange={(checked) => handlePrivacyToggle('showPhone')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-purple-700"><CreditCard className="h-5 w-5" /> Billing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-purple-50 transition-colors">
                <div>
                  <h3 className="font-medium">Card on File</h3>
                  <p className="text-sm text-gray-500">You have a card saved for quick payments.</p>
                </div>
                <Switch
                  id="card-on-file"
                  checked={settings.billing.cardOnFile}
                  onCheckedChange={(checked) => handlePrivacyToggle('cardOnFile')}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-purple-50 transition-colors">
                <div>
                  <h3 className="font-medium">Auto-Renew Subscription</h3>
                  <p className="text-sm text-gray-500">Automatically renew your subscription each month.</p>
                </div>
                <Switch
                  id="auto-renew"
                  checked={settings.billing.autoRenew}
                  onCheckedChange={(checked) => handlePrivacyToggle('autoRenew')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-yellow-600"><Sun className="h-5 w-5" /> Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-yellow-50 transition-colors">
                <div>
                  <h3 className="font-medium">Light Mode</h3>
                  <p className="text-sm text-gray-500">Use a bright, light color theme.</p>
                </div>
                <Switch
                  id="light-mode"
                  checked={theme === 'light'}
                  onCheckedChange={() => setTheme('light')}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-yellow-50 transition-colors">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Use a dark, eye-friendly color theme.</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={() => setTheme('dark')}
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-yellow-50 transition-colors">
                <div>
                  <h3 className="font-medium">System Default</h3>
                  <p className="text-sm text-gray-500">Match your device's theme preference.</p>
                </div>
                <Switch
                  id="system-mode"
                  checked={theme === 'system'}
                  onCheckedChange={() => setTheme('system')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-rwanda-green hover:bg-rwanda-green/90 px-8 py-2 text-lg font-semibold"
          >
            <Save className="h-5 w-5 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Tabs>
    </div>
  );
};

export default UserSettings; 