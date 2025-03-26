"use client";

import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Edit, Plus, User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button variant="outline" className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="relative mb-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <User className="h-12 w-12 text-primary" />
              </div>
              <button className="absolute bottom-0 right-0 rounded-full bg-primary p-1 text-primary-foreground">
                <Edit className="h-4 w-4" />
              </button>
            </div>
            <h2 className="text-xl font-semibold">John Smith</h2>
            <p className="text-sm text-muted-foreground">
              john.smith@example.com
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              +1 (555) 123-4567
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </label>
                <p>June 15, 1985</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Gender
                </label>
                <p>Male</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Blood Type
                </label>
                <p>O+</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Height
                </label>
                <p>5' 10" (178 cm)</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Weight
                </label>
                <p>165 lbs (75 kg)</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  BMI
                </label>
                <p>23.7 (Normal)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Sarah Smith</p>
                  <p className="text-sm text-muted-foreground">
                    Relationship: Spouse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    +1 (555) 987-6543
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Michael Johnson</p>
                  <p className="text-sm text-muted-foreground">
                    Relationship: Brother
                  </p>
                  <p className="text-sm text-muted-foreground">
                    +1 (555) 456-7890
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="outline" className="w-full gap-2">
                Add Emergency Contact
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Medical Allergies & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium">Allergies</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    Penicillin
                  </span>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    Shellfish
                  </span>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    Peanuts
                  </span>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Chronic Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    Asthma
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    Hypertension
                  </span>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
