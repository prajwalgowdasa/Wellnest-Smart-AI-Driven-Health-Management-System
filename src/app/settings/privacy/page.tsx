"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function PrivacyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    autoLogout: true,
    loginNotifications: true,
    dataSharing: "none", // none, anonymous, full
    activityLogging: true,
    locationServices: false,
    cookiePreferences: "essential", // essential, functional, analytics, advertising
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (key: keyof typeof settings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Privacy settings updated",
        description: "Your privacy and security preferences have been saved.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Privacy & Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage your privacy settings and security preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Configure security settings for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              id="two-factor-auth"
              checked={settings.twoFactorAuth}
              onCheckedChange={() => handleToggle("twoFactorAuth")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-logout">Auto Logout</Label>
              <p className="text-sm text-muted-foreground">
                Automatically log out after 30 minutes of inactivity
              </p>
            </div>
            <Switch
              id="auto-logout"
              checked={settings.autoLogout}
              onCheckedChange={() => handleToggle("autoLogout")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="login-notifications">Login Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for new logins to your account
              </p>
            </div>
            <Switch
              id="login-notifications"
              checked={settings.loginNotifications}
              onCheckedChange={() => handleToggle("loginNotifications")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Privacy</CardTitle>
          <CardDescription>
            Control how your data is used and shared
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Data Sharing Preferences</Label>
            <RadioGroup
              value={settings.dataSharing}
              onValueChange={(value) => handleChange("dataSharing", value)}
            >
              <div className="flex items-start space-x-2 pt-2">
                <RadioGroupItem value="none" id="data-none" />
                <div className="space-y-1">
                  <Label htmlFor="data-none">No data sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Your data will not be shared with third parties
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-4">
                <RadioGroupItem value="anonymous" id="data-anonymous" />
                <div className="space-y-1">
                  <Label htmlFor="data-anonymous">Anonymous data sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Share anonymized data for research and service improvement
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-4">
                <RadioGroupItem value="full" id="data-full" />
                <div className="space-y-1">
                  <Label htmlFor="data-full">Full data sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Share your data with healthcare partners for personalized
                    services
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="activity-logging">Activity Logging</Label>
              <p className="text-sm text-muted-foreground">
                Log your activity for personal health insights
              </p>
            </div>
            <Switch
              id="activity-logging"
              checked={settings.activityLogging}
              onCheckedChange={() => handleToggle("activityLogging")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="location-services">Location Services</Label>
              <p className="text-sm text-muted-foreground">
                Allow the app to access your location
              </p>
            </div>
            <Switch
              id="location-services"
              checked={settings.locationServices}
              onCheckedChange={() => handleToggle("locationServices")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cookie Preferences</CardTitle>
          <CardDescription>Manage your cookie preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={settings.cookiePreferences}
            onValueChange={(value) => handleChange("cookiePreferences", value)}
            className="space-y-4"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="essential" id="cookie-essential" />
              <div className="space-y-1">
                <Label htmlFor="cookie-essential">Essential Only</Label>
                <p className="text-sm text-muted-foreground">
                  Only cookies necessary for the website to function
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <RadioGroupItem value="functional" id="cookie-functional" />
              <div className="space-y-1">
                <Label htmlFor="cookie-functional">
                  Essential & Functional
                </Label>
                <p className="text-sm text-muted-foreground">
                  Includes cookies that enhance functionality and user
                  experience
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <RadioGroupItem value="analytics" id="cookie-analytics" />
              <div className="space-y-1">
                <Label htmlFor="cookie-analytics">Include Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Also includes cookies that help us analyze site usage
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <RadioGroupItem value="advertising" id="cookie-advertising" />
              <div className="space-y-1">
                <Label htmlFor="cookie-advertising">All Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Includes advertising cookies for personalized content
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Preferences
      </Button>
    </div>
  );
}
