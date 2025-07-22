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
  Calendar,
  HelpCircle,
  Moon
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

interface TalentSettings {
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
    showReviews: boolean;
    showEarnings: boolean;
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
      <div className="flex items-center gap-4">
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

const SettingItem = ({ title, description, icon, action, isHighlighted }: SettingItemProps) => (
  <div className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${isHighlighted ? 'bg-yellow-50 border-yellow-200' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
    <div className="flex items-center gap-3">
      {icon && <div className="flex-shrink-0">{icon}</div>}
      <div>
        <h3 className="font-medium">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </div>
    <div>
      {action}
    </div>
  </div>
);

const TalentSettingsPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    bookingUpdates: true,
    marketing: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    showContactInfo: true,
    showReviews: true,
    showEarnings: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get('/api/talent/settings')
      .then(res => {
        const data = res.data;
        if (data.notifications) setNotifications(data.notifications);
        if (data.privacy) setPrivacy(data.privacy);
      })
      .catch(err => {
        setError("Could not load settings. Please try refreshing.");
        toast.error("Failed to load settings.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.put('/api/talent/settings', {
        notifications,
        privacy
      });
      toast.success("Settings saved successfully!");
    } catch (err) {
      setError("Failed to save settings. Please try again.");
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    console.log("Signing out from settings page...");
    localStorage.removeItem('token');
    toast.success("Logged out successfully.");
    navigate("/signin");
  };

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Settings</h1>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2">
          <TabsTrigger value="notifications" className="flex-col sm:flex-row h-auto sm:h-10 py-2 sm:py-0">
            <Bell className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex-col sm:flex-row h-auto sm:h-10 py-2 sm:py-0">
            <Shield className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex-col sm:flex-row h-auto sm:h-10 py-2 sm:py-0">
            <CreditCard className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex-col sm:flex-row h-auto sm:h-10 py-2 sm:py-0">
            <Sun className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive important updates via email.</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium">SMS Notifications</h3>
                  <p className="text-sm text-gray-500">Get critical alerts via SMS (charges may apply).</p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={notifications.sms}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, sms: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive real-time updates on your device.</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium">Booking Updates</h3>
                  <p className="text-sm text-gray-500">Get notified for new bookings or changes.</p>
                </div>
                <Switch
                  id="booking-updates"
                  checked={notifications.bookingUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, bookingUpdates: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium">Marketing Emails</h3>
                  <p className="text-sm text-gray-500">Receive news, offers, and promotions.</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, marketing: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium">Profile Visibility</h3>
                  <p className="text-sm text-gray-500">Control who can see your talent profile.</p>
                </div>
                <Switch
                  id="profile-visibility"
                  checked={privacy.profileVisibility}
                  onCheckedChange={(checked) => 
                    setPrivacy({ ...privacy, profileVisibility: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium">Show Contact Information</h3>
                  <p className="text-sm text-gray-500">Display email and phone on your public profile.</p>
                </div>
                <Switch
                  id="show-contact-info"
                  checked={privacy.showContactInfo}
                  onCheckedChange={(checked) => 
                    setPrivacy({ ...privacy, showContactInfo: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium">Show Reviews</h3>
                  <p className="text-sm text-gray-500">Allow clients to see your reviews.</p>
                </div>
                <Switch
                  id="show-reviews"
                  checked={privacy.showReviews}
                  onCheckedChange={(checked) => 
                    setPrivacy({ ...privacy, showReviews: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium">Show Earnings Statistics</h3>
                  <p className="text-sm text-gray-500">Display aggregated earnings on your dashboard (private).</p>
                </div>
                <Switch
                  id="show-earnings"
                  checked={privacy.showEarnings}
                  onCheckedChange={(checked) => 
                    setPrivacy({ ...privacy, showEarnings: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber" className="text-sm font-medium">Card Number</Label>
                  <Input id="cardNumber" type="text" placeholder="•••• •••• •••• ••••" className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry" className="text-sm font-medium">Expiry Date</Label>
                    <Input id="expiry" type="text" placeholder="MM/YY" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-sm font-medium">CVV</Label>
                    <Input id="cvv" type="text" placeholder="•••" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="nameOnCard" className="text-sm font-medium">Name on Card</Label>
                  <Input id="nameOnCard" type="text" placeholder="Enter name as it appears on card" className="mt-1"/>
                </div>
              </div>
              <Button className="w-full bg-rwanda-green hover:bg-rwanda-green/90 text-white">
                Update Payment Method
              </Button>
              <p className="text-xs text-gray-500 text-center">Your payment information is stored securely.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Toggle between light and dark themes.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className={`h-5 w-5 transition-all ${theme === 'light' ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                  <Switch
                    id="dark-mode"
                    checked={theme === 'dark'}
                    onCheckedChange={handleThemeChange}
                    aria-label="Toggle dark mode"
                  />
                  <Moon className={`h-5 w-5 transition-all ${theme === 'dark' ? 'text-blue-500' : 'text-muted-foreground'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium">Compact View</h3>
                  <p className="text-sm text-gray-500">Reduce padding for a more compact layout.</p>
                </div>
                <Switch id="compact-view" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-10 space-y-3">
        <Button variant="outline" className="w-full justify-start p-4 h-auto group hover:bg-gray-50">
          <HelpCircle className="h-5 w-5 mr-3 text-gray-500 group-hover:text-rwanda-green" />
          <span className="font-medium">Help & Support</span>
        </Button>
        <Button variant="outline" className="w-full justify-start p-4 h-auto group hover:bg-red-50" onClick={handleSignOut}>
          <LogOut className="h-5 w-5 mr-3 text-gray-500 group-hover:text-red-600" />
          <span className="font-medium group-hover:text-red-600">Sign Out</span>
        </Button>
      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={handleSave}
          className="bg-rwanda-green hover:bg-rwanda-green/90 px-8 py-2 text-lg font-semibold"
          disabled={loading}
        >
          {Save && <Save className="h-5 w-5 mr-2" />}
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      {error && <div className="text-red-600 text-center mt-4">{error}</div>}
    </div>
  );
};

export default TalentSettingsPage;