import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Lock, 
  CreditCard, 
  Globe, 
  Shield, 
  HelpCircle,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

const TalentSettings = () => {
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
    </div>
  );
};

export default TalentSettings; 