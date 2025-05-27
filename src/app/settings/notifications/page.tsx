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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: true,
    medicationReminders: true,
    healthTips: false,
    weeklyReports: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Communication Channels</CardTitle>
          <CardDescription>
            Control which channels we use to reach you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle("emailNotifications")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via text message
              </p>
            </div>
            <Switch
              id="sms-notifications"
              checked={settings.smsNotifications}
              onCheckedChange={() => handleToggle("smsNotifications")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications on your device
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={() => handleToggle("pushNotifications")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            Select which types of notifications you'd like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appointment-reminders">
                Appointment Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified about upcoming appointments
              </p>
            </div>
            <Switch
              id="appointment-reminders"
              checked={settings.appointmentReminders}
              onCheckedChange={() => handleToggle("appointmentReminders")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="medication-reminders">Medication Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when it's time to take medications
              </p>
            </div>
            <Switch
              id="medication-reminders"
              checked={settings.medicationReminders}
              onCheckedChange={() => handleToggle("medicationReminders")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="health-tips">Health Tips & Articles</Label>
              <p className="text-sm text-muted-foreground">
                Receive personalized health tips and articles
              </p>
            </div>
            <Switch
              id="health-tips"
              checked={settings.healthTips}
              onCheckedChange={() => handleToggle("healthTips")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-reports">Weekly Health Reports</Label>
              <p className="text-sm text-muted-foreground">
                Receive weekly summaries of your health data
              </p>
            </div>
            <Switch
              id="weekly-reports"
              checked={settings.weeklyReports}
              onCheckedChange={() => handleToggle("weeklyReports")}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Preferences
      </Button>
    </div>
  );
}
