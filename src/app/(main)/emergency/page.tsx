"use client";

import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  FileText,
  Heart,
  MapPin,
  Phone,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isEmergencyContact: boolean;
}

interface NearbyFacility {
  id: string;
  name: string;
  type: "hospital" | "urgent-care" | "pharmacy";
  address: string;
  distance: string;
  phone: string;
  openNow: boolean;
}

export default function EmergencyPage() {
  // Sample emergency contacts
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([
    {
      id: "1",
      name: "Sarah Smith",
      relationship: "Spouse",
      phone: "+1 (555) 987-6543",
      isEmergencyContact: true,
    },
    {
      id: "2",
      name: "Michael Johnson",
      relationship: "Brother",
      phone: "+1 (555) 456-7890",
      isEmergencyContact: true,
    },
    {
      id: "3",
      name: "Dr. Sarah Johnson",
      relationship: "Primary Care Physician",
      phone: "+1 (555) 123-4567",
      isEmergencyContact: false,
    },
  ]);

  // Sample nearby healthcare facilities
  const [nearbyFacilities, setNearbyFacilities] = useState<NearbyFacility[]>([
    {
      id: "1",
      name: "City General Hospital",
      type: "hospital",
      address: "123 Main Street, City, State",
      distance: "2.3 miles",
      phone: "+1 (555) 111-2222",
      openNow: true,
    },
    {
      id: "2",
      name: "MedExpress Urgent Care",
      type: "urgent-care",
      address: "456 Oak Avenue, City, State",
      distance: "0.8 miles",
      phone: "+1 (555) 333-4444",
      openNow: true,
    },
    {
      id: "3",
      name: "24/7 Pharmacy Plus",
      type: "pharmacy",
      address: "789 Pine Street, City, State",
      distance: "1.5 miles",
      phone: "+1 (555) 555-6666",
      openNow: true,
    },
    {
      id: "4",
      name: "Riverside Medical Center",
      type: "hospital",
      address: "101 River Road, City, State",
      distance: "3.7 miles",
      phone: "+1 (555) 777-8888",
      openNow: true,
    },
  ]);

  // Sample medical information for quick access
  const medicalInfo = {
    bloodType: "O+",
    allergies: ["Penicillin", "Shellfish", "Peanuts"],
    conditions: ["Asthma", "Hypertension"],
    medications: ["Lisinopril 10mg", "Ventolin (as needed)"],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Emergency</h1>
        <Link href="/profile">
          <Button variant="outline" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Emergency Contact
          </Button>
        </Link>
      </div>

      {/* Emergency Services Card */}
      <Card className="border-2 border-red-500 dark:border-red-600">
        <CardHeader className="bg-red-100 dark:bg-red-900/30">
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            Emergency Services
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 p-6 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium">Call Emergency Services</h3>
            <p className="text-sm text-muted-foreground">
              If you're experiencing a medical emergency, call emergency
              services immediately.
            </p>
            <Button className="mt-2 w-full gap-2 bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700">
              <Phone className="h-4 w-4" />
              Call 911
            </Button>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Contact Nurse Hotline</h3>
            <p className="text-sm text-muted-foreground">
              For immediate medical advice, call our 24/7 nurse hotline.
            </p>
            <Button variant="outline" className="mt-2 w-full gap-2">
              <Phone className="h-4 w-4" />
              Call Nurse Hotline
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencyContacts
              .filter((c) => c.isEmergencyContact)
              .map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Relationship: {contact.relationship}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contact.phone}
                    </p>
                  </div>
                  <Button className="gap-2" variant="outline">
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                </div>
              ))}
            {emergencyContacts.filter((c) => c.isEmergencyContact).length ===
              0 && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <UserPlus className="mb-2 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-1 text-lg font-medium">
                  No emergency contacts
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Add emergency contacts to quickly reach them in case of
                  emergency.
                </p>
                <Link href="/profile">
                  <Button>Add Emergency Contact</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Medical Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quick Access Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 font-medium">
                <Heart className="h-4 w-4 text-red-500" />
                Blood Type
              </h3>
              <p className="text-2xl font-bold">{medicalInfo.bloodType}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {medicalInfo.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {medicalInfo.conditions.map((condition, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Current Medications</h3>
              <ul className="space-y-1 text-sm">
                {medicalInfo.medications.map((medication, index) => (
                  <li key={index}>{medication}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/profile">
              <Button variant="outline">View Full Medical Profile</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Facilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nearby Healthcare Facilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nearbyFacilities.map((facility) => (
              <div
                key={facility.id}
                className="flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{facility.name}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        facility.type === "hospital"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : facility.type === "urgent-care"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {facility.type === "hospital"
                        ? "Hospital"
                        : facility.type === "urgent-care"
                        ? "Urgent Care"
                        : "Pharmacy"}
                    </span>
                    {facility.openNow && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Open Now
                      </span>
                    )}
                  </div>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {facility.address} • {facility.distance}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <MapPin className="h-3 w-3" />
                    Directions
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Phone className="h-3 w-3" />
                    {facility.phone}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium">When to Call 911</h3>
              <ul className="list-inside list-disc space-y-1 text-sm">
                <li>
                  Chest pain or pressure that lasts more than a few minutes
                </li>
                <li>Difficulty breathing or shortness of breath</li>
                <li>Sudden severe pain</li>
                <li>Sudden dizziness, weakness, or changes in vision</li>
                <li>Severe or persistent vomiting or diarrhea</li>
                <li>Uncontrolled bleeding</li>
                <li>Severe burns or wounds</li>
                <li>Suspected poisoning</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium">When to Visit Urgent Care</h3>
              <ul className="list-inside list-disc space-y-1 text-sm">
                <li>Minor cuts or wounds that may require stitches</li>
                <li>Sprains, strains, or minor fractures</li>
                <li>Mild to moderate asthma attacks</li>
                <li>Fever without a rash</li>
                <li>Persistent diarrhea</li>
                <li>Vomiting</li>
                <li>Severe sore throat or cough</li>
                <li>Minor burns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
