"use client";

import EmergencyContacts from "@/components/profile/EmergencyContacts";
import UserProfile from "@/components/profile/UserProfile";

export default function ProfilePage() {
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="space-y-8">
        <UserProfile />
        <EmergencyContacts />
      </div>
    </div>
  );
}
