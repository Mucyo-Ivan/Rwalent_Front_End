/** @jsxImportSource react */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Lock, 
  Mail, 
  Globe, 
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
  LogOut,
  Volume2,
  MessageSquare,
  Clock,
  RefreshCw,
  UserCheck,
  CircleUser,
  Sparkles,
  Gift,
  BellRing,
  Languages,
  Palette,
  Calendar
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserSettings {
  email: string;
  phoneNumber: string;
  location: string;
  language: string;
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
    bookings: boolean;
    messages: boolean;
    birthdayReminders?: boolean;
  };
  privacy: {
    profileVisibility: boolean;
    showLocation: boolean;
    showPhone: boolean;
    showEmail: boolean;
    activityStatus: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginAlerts: boolean;
  };
  billing: {
    cardOnFile: boolean;
    autoRenew: boolean;
  };
  appearance: {
    density: 'compact' | 'normal' | 'spacious';
    fontSize: 'small' | 'medium' | 'large';
    animations: boolean;
  };
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
  };
}

interface SettingsSectionProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  color: string;
  children: React.ReactNode;
}

const SettingsSection = ({ icon, title, description, color, children }: SettingsSectionProps) => (
  <Card className="mb-6 border-t-4" style={{ borderTopColor: color }}>
    <CardHeader className="pb-2">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full" style={{ backgroundColor: `${color}15` }}>
          {icon}
        </div>
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

interface SettingItemProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action: React.ReactNode;
  isHighlighted?: boolean;
}

const SettingItem = ({ title, description, icon, action, isHighlighted = false }: SettingItemProps) => (
  <div className={`flex items-center justify-between p-4 rounded-lg transition-colors ${isHighlighted ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-700' : 'border hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
    <div className="flex items-start gap-3">
      {icon && <div className="mt-1 flex-shrink-0">{icon}</div>}
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="flex-shrink-0">
      {action}
    </div>
  </div>
);

const UserSettings = () => {
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // This would be mocked data for now - in a real app, this would be an API call
      // const data = await auth.getUserSettings();
      
      // Mock data for demonstration
      const mockData: UserSettings = {
        email: userProfile?.email || 'user@example.com',
        phoneNumber: '+1234567890',
        location: 'Kigali, Rwanda',
        language: 'English',
        theme: theme as 'light' | 'dark',
        notifications: {
          email: true,
          push: true,
          sms: false,
          marketing: false,
          bookings: true,
          messages: true
        },
        privacy: {
          profileVisibility: true,
          showLocation: true,
          showPhone: false,
          showEmail: false,
          activityStatus: true
        },
        security: {
          twoFactorEnabled: false,
          lastPasswordChange: '2025-04-01',
          loginAlerts: true
        },
        billing: {
          cardOnFile: false,
          autoRenew: false
        },
        appearance: {
          density: 'normal',
          fontSize: 'medium',
          animations: true
        },
        accessibility: {
          reduceMotion: false,
          highContrast: false,
          screenReader: false
        }
      };
      
      setSettings(mockData);
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
    toast(`${type} notifications ${!settings.notifications[type] ? 'enabled' : 'disabled'}`)
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
    toast(`Privacy setting updated`);
  };
  
  const handleSecurityToggle = (type: keyof UserSettings['security']) => {
    if (!settings || type === 'lastPasswordChange') return;
    setSettings(prev => ({
      ...prev!,
      security: {
        ...prev!.security,
        [type]: !prev!.security[type]
      }
    }));
    toast(`Security setting updated`);
  };
  
  const handleAccessibilityToggle = (type: keyof UserSettings['accessibility']) => {
    if (!settings) return;
    setSettings(prev => ({
      ...prev!,
      accessibility: {
        ...prev!.accessibility,
        [type]: !prev!.accessibility[type]
      }
    }));
    toast(`Accessibility setting updated`);
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      // This would be replaced with your actual API call
      // await auth.updateUserSettings(settings);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast("Settings updated successfully!");
    } catch (error: any) {
      console.error("Failed to update settings:", error);
      toast("Failed to update settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast("New passwords do not match!");
      return;
    }

    setIsSaving(true);
    try {
      // This would be replaced with your actual API call
      // await auth.changePassword(currentPassword, newPassword);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast("Password changed successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error("Failed to change password:", error);
      toast("Failed to change password. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    logout();
    toast("You have been signed out.");
    navigate("/signin");
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="h-14 w-14 rounded-full bg-gray-200 animate-pulse" />
          <div>
            <div className="h-8 w-[200px] bg-gray-200 animate-pulse" />
            <div className="h-4 w-[150px] mt-2 bg-gray-200 animate-pulse" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
          <div>
            <div className="h-10 w-full mb-4 bg-gray-200 animate-pulse" />
            <div className="h-10 w-full mb-4 bg-gray-200 animate-pulse" />
            <div className="h-10 w-full mb-4 bg-gray-200 animate-pulse" />
            <div className="h-10 w-full mb-4 bg-gray-200 animate-pulse" />
            <div className="h-10 w-full mb-4 bg-gray-200 animate-pulse" />
          </div>
          
          <div className="space-y-6">
            <div className="h-8 w-[200px] bg-gray-200 animate-pulse" />
            <div className="grid grid-cols-1 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex">
                      <div className="h-10 w-10 rounded-full mr-3 bg-gray-200 animate-pulse" />
                      <div className="h-6 w-[150px] bg-gray-200 animate-pulse" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-16 w-full mb-4 bg-gray-200 animate-pulse" />
                    <div className="h-16 w-full mb-4 bg-gray-200 animate-pulse" />
                    <div className="h-16 w-full bg-gray-200 animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              {X && <X className="h-5 w-5 text-red-500" />}
            </div>
            <div className="ml-3">
              <p className="font-medium text-red-800">Error Loading Settings</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <Button onClick={fetchSettings} variant="outline" className="mt-4">
            {RefreshCw && <RefreshCw className="mr-2 h-4 w-4" />} Retry
          </Button>
        </div>
        
        <Button 
          onClick={() => navigate(-1)} 
          variant="secondary"
        >
          Go Back
        </Button>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4">
      {/* Header with user profile */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full border-2 border-rwanda-green bg-rwanda-green text-white text-xl font-bold flex items-center justify-center">
            {userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {userProfile?.fullName || 'Your Settings'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {userProfile?.email || 'Manage your account preferences'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-start">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate('/profile')}
          >
            <User className="h-4 w-4" />
            View Profile
          </Button>
          <Button 
            variant="default" 
            className="gap-2 bg-rwanda-green hover:bg-rwanda-green/90"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                {RefreshCw && <RefreshCw className="h-4 w-4 animate-spin" />}
                Saving...
              </>
            ) : (
              <>
                {Save && <Save className="h-4 w-4" />}
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main content with sidebar and settings sections */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        {/* Settings navigation sidebar */}
        <Card className="h-fit lg:sticky lg:top-6">
          <CardContent className="p-4">
            <nav className="space-y-1">
              <Button 
                variant={activeTab === 'general' ? 'default' : 'ghost'} 
                className="w-full justify-start gap-3 mb-1"
                onClick={() => setActiveTab('general')}
              >
                <User className="h-5 w-5" />
                General
              </Button>
              <Button 
                variant={activeTab === 'appearance' ? 'default' : 'ghost'} 
                className="w-full justify-start gap-3 mb-1"
                onClick={() => setActiveTab('appearance')}
              >
                <Palette className="h-5 w-5" />
                Appearance
              </Button>
              <Button 
                variant={activeTab === 'notifications' ? 'default' : 'ghost'} 
                className="w-full justify-start gap-3 mb-1"
                onClick={() => setActiveTab('notifications')}
              >
                <BellRing className="h-5 w-5" />
                Notifications
              </Button>
              <Button 
                variant={activeTab === 'privacy' ? 'default' : 'ghost'} 
                className="w-full justify-start gap-3 mb-1"
                onClick={() => setActiveTab('privacy')}
              >
                <Shield className="h-5 w-5" />
                Privacy
              </Button>
              <Button 
                variant={activeTab === 'security' ? 'default' : 'ghost'} 
                className="w-full justify-start gap-3 mb-1"
                onClick={() => setActiveTab('security')}
              >
                <Lock className="h-5 w-5" />
                Security
              </Button>
              <Button 
                variant={activeTab === 'accessibility' ? 'default' : 'ghost'} 
                className="w-full justify-start gap-3 mb-1"
                onClick={() => setActiveTab('accessibility')}
              >
                <UserCheck className="h-5 w-5" />
                Accessibility
              </Button>
              <Button 
                variant={activeTab === 'billing' ? 'default' : 'ghost'} 
                className="w-full justify-start gap-3 mb-1"
                onClick={() => setActiveTab('billing')}
              >
                <CreditCard className="h-5 w-5" />
                Billing
              </Button>
              
              <Separator className="my-3" />
              
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </nav>
          </CardContent>
        </Card>
        
        {/* Tab Content Area */}
        <div className="space-y-6">
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <SettingsSection 
                icon={<CircleUser className="h-6 w-6 text-blue-600" />} 
                title="Profile Information" 
                description="Manage your personal information"
                color="#3b82f6"
              >
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right hidden md:block">Full Name</Label>
                      <div className="md:col-span-3">
                        <Label htmlFor="name" className="md:hidden mb-1 block">Full Name</Label>
                        <Input id="name" defaultValue={userProfile?.fullName || ''} placeholder="Your name" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right hidden md:block">Email</Label>
                      <div className="md:col-span-3">
                        <Label htmlFor="email" className="md:hidden mb-1 block">Email</Label>
                        <Input id="email" defaultValue={settings.email} disabled className="bg-gray-50" />
                        <p className="text-xs text-muted-foreground mt-1">Your email is used for sign-in and cannot be changed</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right hidden md:block">Phone Number</Label>
                      <div className="md:col-span-3">
                        <Label htmlFor="phone" className="md:hidden mb-1 block">Phone Number</Label>
                        <Input id="phone" defaultValue={settings.phoneNumber} placeholder="+250 7XX XXX XXX" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right hidden md:block">Location</Label>
                      <div className="md:col-span-3">
                        <Label htmlFor="location" className="md:hidden mb-1 block">Location</Label>
                        <Input id="location" defaultValue={settings.location} placeholder="City, Country" />
                      </div>
                    </div>
                  </div>
                </div>
              </SettingsSection>
              
              <SettingsSection 
                icon={<Languages className="h-6 w-6 text-emerald-600" />} 
                title="Language & Region" 
                description="Select your preferred language"
                color="#10b981"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <Label htmlFor="language" className="text-right hidden md:block">Language</Label>
                    <div className="md:col-span-3">
                      <Label htmlFor="language" className="md:hidden mb-1 block">Language</Label>
                      <Select defaultValue={settings.language}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="Kinyarwanda">Kinyarwanda</SelectItem>
                          <SelectItem value="Swahili">Swahili</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </SettingsSection>
            </div>
          )}
          
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div>
              <SettingsSection 
                icon={<Sun className="h-6 w-6 text-amber-500" />} 
                title="Theme Preferences" 
                description="Customize how Rwalent looks"
                color="#f59e0b"
              >
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Select a theme</h3>
                  <ThemeSelector />
                </div>
              </SettingsSection>
            </div>
          )}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <SettingsSection 
                icon={<BellRing className="h-6 w-6 text-blue-600" />} 
                title="Notification Preferences" 
                description="Control how you receive alerts and updates"
                color="#3b82f6"
              >
                <div className="space-y-4">
                  <SettingItem
                    title="Email Notifications"
                    description="Receive important updates via email"
                    icon={<Mail className="h-5 w-5 text-blue-500" />}
                    action={
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={() => handleNotificationToggle('email')}
                      />
                    }
                  />
                  
                  <SettingItem
                    title="SMS Notifications"
                    description="Get critical alerts via SMS (charges may apply)"
                    icon={<Smartphone className="h-5 w-5 text-blue-500" />}
                    action={
                      <Switch
                        checked={settings.notifications.sms}
                        onCheckedChange={() => handleNotificationToggle('sms')}
                      />
                    }
                  />
                  
                  <SettingItem
                    title="Push Notifications"
                    description="Receive real-time updates on your device"
                    icon={<Bell className="h-5 w-5 text-blue-500" />}
                    action={
                      <Switch
                        checked={settings.notifications.push}
                        onCheckedChange={() => handleNotificationToggle('push')}
                      />
                    }
                  />
                  
                  <SettingItem
                    title="Booking Notifications"
                    description="Get notified about booking requests and confirmations"
                    icon={<Calendar className="h-5 w-5 text-blue-500" />}
                    action={
                      <Switch
                        checked={settings.notifications.bookings}
                        onCheckedChange={() => handleNotificationToggle('bookings')}
                      />
                    }
                    isHighlighted={true}
                  />
                  
                  <SettingItem
                    title="Message Notifications"
                    description="Get notified when you receive new messages"
                    icon={<MessageSquare className="h-5 w-5 text-blue-500" />}
                    action={
                      <Switch
                        checked={settings.notifications.messages}
                        onCheckedChange={() => handleNotificationToggle('messages')}
                      />
                    }
                  />
                  
                  <SettingItem
                    title="Marketing Emails"
                    description="Receive news, offers, and promotions"
                    icon={<Mail className="h-5 w-5 text-blue-500" />}
                    action={
                      <Switch
                        checked={settings.notifications.marketing}
                        onCheckedChange={() => handleNotificationToggle('marketing')}
                      />
                    }
                  />
                </div>
              </SettingsSection>
            </div>
          )}
          
          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <SettingsSection 
                icon={<Shield className="h-6 w-6 text-green-600" />} 
                title="Privacy Settings" 
                description="Control who can see your information"
                color="#10b981"
              >
                <div className="space-y-4">
                  <SettingItem
                    title="Profile Visibility"
                    description="Control who can see your profile"
                    icon={<User className="h-5 w-5 text-green-500" />}
                    action={
                      <Switch
                        checked={settings.privacy.profileVisibility}
                        onCheckedChange={() => handlePrivacyToggle('profileVisibility')}
                      />
                    }
                  />
                  
                  <SettingItem
                    title="Show Location"
                    description="Display your location on your profile"
                    icon={<MapPin className="h-5 w-5 text-green-500" />}
                    action={
                      <Switch
                        checked={settings.privacy.showLocation}
                        onCheckedChange={() => handlePrivacyToggle('showLocation')}
                      />
                    }
                  />
                  
                  <SettingItem
                    title="Show Email"
                    description="Display your email on your profile"
                    icon={<Mail className="h-5 w-5 text-green-500" />}
                    action={
                      <Switch
                        checked={settings.privacy.showEmail}
                        onCheckedChange={() => handlePrivacyToggle('showEmail')}
                      />
                    }
                  />
                  
                  <SettingItem
                    title="Show Phone Number"
                    description="Display your phone number on your profile"
                    icon={<Smartphone className="h-5 w-5 text-green-500" />}
                    action={
                      <Switch
                        checked={settings.privacy.showPhone}
                        onCheckedChange={() => handlePrivacyToggle('showPhone')}
                      />
                    }
                  />
                  
                  <SettingItem
                    title="Activity Status"
                    description="Show when you're online or last active"
                    icon={<Clock className="h-5 w-5 text-green-500" />}
                    action={
                      <Switch
                        checked={settings.privacy.activityStatus}
                        onCheckedChange={() => handlePrivacyToggle('activityStatus')}
                      />
                    }
                  />
                </div>
              </SettingsSection>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <SettingsSection 
                icon={<Lock className="h-6 w-6 text-purple-600" />} 
                title="Security Settings" 
                description="Manage your account security"
                color="#9333ea"
              >
                <div className="space-y-4">
                  <SettingItem
                    title="Two-Factor Authentication"
                    description="Add an extra layer of security to your account"
                    icon={<UserCheck className="h-5 w-5 text-purple-500" />}
                    action={
                      <Switch
                        checked={settings.security.twoFactorEnabled}
                        onCheckedChange={() => handleSecurityToggle('twoFactorEnabled')}
                      />
                    }
                    isHighlighted={!settings.security.twoFactorEnabled}
                  />
                  
                  <SettingItem
                    title="Login Alerts"
                    description="Get notified of new sign-ins to your account"
                    icon={<Bell className="h-5 w-5 text-purple-500" />}
                    action={
                      <Switch
                        checked={settings.security.loginAlerts}
                        onCheckedChange={() => handleSecurityToggle('loginAlerts')}
                      />
                    }
                  />
                </div>
              </SettingsSection>
              
              <SettingsSection 
                icon={<Lock className="h-6 w-6 text-purple-600" />} 
                title="Change Password" 
                color="#9333ea"
              >
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <Label htmlFor="current-password" className="text-right hidden md:block">Current Password</Label>
                      <div className="md:col-span-3 relative">
                        <Label htmlFor="current-password" className="md:hidden mb-1 block">Current Password</Label>
                        <div className="relative">
                          <Input 
                            id="current-password" 
                            type={showPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-password" className="text-right hidden md:block">New Password</Label>
                      <div className="md:col-span-3">
                        <Label htmlFor="new-password" className="md:hidden mb-1 block">New Password</Label>
                        <Input 
                          id="new-password" 
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <Label htmlFor="confirm-password" className="text-right hidden md:block">Confirm Password</Label>
                      <div className="md:col-span-3">
                        <Label htmlFor="confirm-password" className="md:hidden mb-1 block">Confirm Password</Label>
                        <Input 
                          id="confirm-password" 
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handlePasswordChange} 
                      disabled={isSaving || !currentPassword || !newPassword || !confirmPassword} 
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isSaving ? (
                        <>
                          {RefreshCw && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                          Changing...
                        </>
                      ) : (
                        <>Change Password</>
                      )}
                    </Button>
                  </div>
                </div>
              </SettingsSection>
            </div>
          )}
          
          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <SettingsSection 
                icon={<CreditCard className="h-6 w-6 text-purple-600" />} 
                title="Billing Settings" 
                description="Manage your payment methods and subscriptions"
                color="#9333ea"
              >
                <div className="space-y-4">
                  <SettingItem
                    title="Card on File"
                    description="You have a card saved for quick payments"
                    icon={<CreditCard className="h-5 w-5 text-purple-500" />}
                    action={
                      <Switch
                        checked={settings.billing.cardOnFile}
                        onCheckedChange={() => {
                          if (!settings) return;
                          setSettings(prev => ({
                            ...prev!,
                            billing: {
                              ...prev!.billing,
                              cardOnFile: !prev!.billing.cardOnFile
                            }
                          }));
                        }}
                      />
                    }
                  />
                  
                  <SettingItem
                    title="Auto-Renew Subscription"
                    description="Automatically renew your subscription each month"
                    icon={<RefreshCw className="h-5 w-5 text-purple-500" />}
                    action={
                      <Switch
                        checked={settings.billing.autoRenew}
                        onCheckedChange={() => {
                          if (!settings) return;
                          setSettings(prev => ({
                            ...prev!,
                            billing: {
                              ...prev!.billing,
                              autoRenew: !prev!.billing.autoRenew
                            }
                          }));
                        }}
                      />
                    }
                  />
                </div>
              </SettingsSection>
            </div>
          )}

          {/* Accessibility Tab */}
          {activeTab === 'accessibility' && (
            <div className="space-y-6">
              <SettingsSection 
                icon={<UserCheck className="h-6 w-6 text-indigo-600" />} 
                title="Accessibility Settings" 
                description="Make Rwalent work better for you"
                color="#6366f1"
              >
                <div className="space-y-4">
                  <SettingItem
                    title="Reduce Motion"
                    description="Minimize animations and transitions"
                    icon={<Sparkles className="h-5 w-5 text-indigo-500" />}
                    action={
                      <Switch
                        checked={settings.accessibility.reduceMotion}
                        onCheckedChange={() => handleAccessibilityToggle('reduceMotion')}
                      />
                    }
                  />
                  
                  <SettingItem
                    title="High Contrast"
                    description="Increase contrast for better visibility"
                    icon={<Sun className="h-5 w-5 text-indigo-500" />}
                    action={
                      <Switch
                        checked={settings.accessibility.highContrast}
                        onCheckedChange={() => handleAccessibilityToggle('highContrast')}
                      />
                    }
                  />
                  
                  <SettingItem
                    title="Screen Reader Support"
                    description="Optimize for screen readers"
                    icon={<Volume2 className="h-5 w-5 text-indigo-500" />}
                    action={
                      <Switch
                        checked={settings.accessibility.screenReader}
                        onCheckedChange={() => handleAccessibilityToggle('screenReader')}
                      />
                    }
                  />
                </div>
              </SettingsSection>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <SettingsSection 
                icon={<Sun className="h-6 w-6 text-yellow-600" />} 
                title="Appearance Settings" 
                description="Customize your Rwalent experience"
                color="#f7dc6f"
              >
                <div className="space-y-4">
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
                </div>
              </SettingsSection>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-rwanda-green hover:bg-rwanda-green/90 px-8 py-2 text-lg font-semibold"
          >
            {Save && <Save className="h-5 w-5 mr-2" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;