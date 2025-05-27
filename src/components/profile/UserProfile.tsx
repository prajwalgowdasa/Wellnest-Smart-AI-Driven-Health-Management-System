"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { getUserProfile } from "@/lib/api";
import { format } from "date-fns";
import { ArrowRight, Camera, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  height: number;
  weight: number;
  bmi: number;
  profilePhoto?: string;
  displayFormat: {
    temperature: string;
    height: string;
    weight: string;
  };
}

// Define a type for the API response to handle optional fields
interface ApiProfileData {
  id?: any;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: Date | string;
  gender?: string;
  blood_type?: string;
  height_cm?: number;
  weight_kg?: number;
  bmi?: number;
  profile_photo?: string;
  displayFormat?: any;
  [key: string]: any;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const apiData: ApiProfileData = await getUserProfile();

      // Format name properly, removing any undefined values
      let formattedName = "";
      if (apiData.name && !apiData.name.includes("undefined")) {
        formattedName = apiData.name;
      } else if (apiData.first_name || apiData.last_name) {
        formattedName = [apiData.first_name || "", apiData.last_name || ""]
          .filter(Boolean)
          .join(" ");
      }

      // Transform API data to match our interface
      const transformedData: UserProfileData = {
        id: apiData.id || "1",
        name: formattedName || "Add your name", // Default message if no name available
        email: apiData.email || "",
        phone: apiData.phone_number || "",
        dateOfBirth: apiData.date_of_birth
          ? apiData.date_of_birth.toString()
          : "",
        gender: apiData.gender || "",
        bloodType: apiData.blood_type || "",
        height: apiData.height_cm || 0,
        weight: apiData.weight_kg || 0,
        bmi: apiData.bmi || 0,
        profilePhoto: apiData.profile_photo || "",
        displayFormat: apiData.displayFormat || {
          temperature: "celsius",
          height: "cm",
          weight: "kg",
        },
      };

      setProfile(transformedData);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64 for demo purposes
      // In a real app, you would upload to a server/storage
      const reader = new FileReader();

      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;

        if (profile) {
          // Update profile with new photo
          const updatedProfile = {
            ...profile,
            profilePhoto: base64Image,
          };

          setProfile(updatedProfile);

          // In a real app, you would send this to your API
          // await updateUserProfile({ profile_photo: base64Image });

          toast({
            title: "Photo updated",
            description: "Your profile photo has been updated.",
          });
        }

        setIsUploading(false);
      };

      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "There was an error uploading your photo.",
          variant: "destructive",
        });
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isLoading && !profile) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle>Personal Information</CardTitle>
        <Button variant="outline" asChild>
          <Link href="/settings/profile">
            <span className="mr-2">Edit in Settings</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
        {profile && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {profile.profilePhoto ? (
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20">
                    <Image
                      src={profile.profilePhoto}
                      alt={profile.name}
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 rounded-full bg-muted flex items-center justify-center border-4 border-primary/20">
                    <User className="h-24 w-24 text-muted-foreground/60" />
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />

                {/* Camera button triggers file input */}
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
                  aria-label="Upload profile photo"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone
                  </p>
                  <p>{profile.phone || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </p>
                  <p>
                    {profile.dateOfBirth
                      ? format(new Date(profile.dateOfBirth), "PP")
                      : "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Gender
                  </p>
                  <p className="capitalize">{profile.gender || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Blood Type
                  </p>
                  <p>{profile.bloodType || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Height
                  </p>
                  <p>{profile.height ? `${profile.height} cm` : "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Weight
                  </p>
                  <p>{profile.weight ? `${profile.weight} kg` : "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    BMI
                  </p>
                  <p>{profile.bmi || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
