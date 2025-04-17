"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAppointment } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Sample data for doctors and locations
const DOCTORS = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    hospital: "City Medical Center",
  },
  {
    id: "2",
    name: "Dr. Michael Wong",
    specialty: "Dentist",
    hospital: "Smile Dental Care",
  },
  {
    id: "3",
    name: "Dr. Lisa Anderson",
    specialty: "Cardiologist",
    hospital: "Heart Health Center",
  },
  {
    id: "4",
    name: "Dr. Robert Smith",
    specialty: "Dermatologist",
    hospital: "Skin & Beauty Clinic",
  },
  {
    id: "5",
    name: "Dr. Emily Davis",
    specialty: "Neurologist",
    hospital: "Brain & Spine Institute",
  },
  {
    id: "6",
    name: "Dr. David Wilson",
    specialty: "Orthopedic Surgeon",
    hospital: "Joint & Bone Hospital",
  },
  {
    id: "7",
    name: "Dr. Jennifer Taylor",
    specialty: "Pediatrician",
    hospital: "Children's Hospital",
  },
  {
    id: "8",
    name: "Dr. James Brown",
    specialty: "Ophthalmologist",
    hospital: "Vision Care Center",
  },
  {
    id: "9",
    name: "Dr. Maria Garcia",
    specialty: "OB/GYN",
    hospital: "Women's Health Center",
  },
  {
    id: "10",
    name: "Dr. Thomas Martin",
    specialty: "Psychiatrist",
    hospital: "Mental Wellness Clinic",
  },
];

// Extract unique specialties from the doctors data
const SPECIALTIES = [
  ...new Set(DOCTORS.map((doctor) => doctor.specialty)),
].sort();

const LOCATIONS = [
  {
    id: "1",
    name: "City Medical Center",
    address: "123 Main Street, Suite 200",
  },
  {
    id: "2",
    name: "Smile Dental Care",
    address: "456 Brush Avenue, 3rd Floor",
  },
  { id: "3", name: "Heart Health Center", address: "789 Cardiac Way" },
  { id: "4", name: "Skin & Beauty Clinic", address: "101 Glow Boulevard" },
  { id: "5", name: "Brain & Spine Institute", address: "202 Neuron Road" },
  { id: "6", name: "Joint & Bone Hospital", address: "303 Skeleton Street" },
  { id: "7", name: "Children's Hospital", address: "404 Kiddie Lane" },
  { id: "8", name: "Vision Care Center", address: "505 Eyesight Avenue" },
  { id: "9", name: "Women's Health Center", address: "606 Maternal Road" },
  { id: "10", name: "Mental Wellness Clinic", address: "707 Mindful Street" },
];

export default function ScheduleAppointmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    specialty: "",
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });

  // Filter doctors based on selected specialty
  const filteredDoctors = formData.specialty
    ? DOCTORS.filter((doctor) => doctor.specialty === formData.specialty)
    : [];

  // Get selected doctor
  const selectedDoctor = DOCTORS.find((d) => d.id === formData.doctorId);

  // Get selected location
  const selectedLocation = selectedDoctor
    ? LOCATIONS.find((l) => l.name === selectedDoctor.hospital)
    : null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "specialty") {
      // When changing specialty, reset the doctor selection
      setFormData((prev) => ({
        ...prev,
        specialty: value,
        doctorId: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format the date and time properly
      const formattedDate = `${formData.date}T${formData.time || "09:00:00"}`;

      const appointmentData = {
        title: formData.title,
        doctor: selectedDoctor?.name || "",
        date: formattedDate,
        purpose: formData.reason,
        location: selectedDoctor?.hospital || "",
        notes: "",
      };

      await createAppointment(appointmentData);
      toast.success("Appointment scheduled successfully");

      // Force a cache refresh for the appointments page
      try {
        // Fetch the /api/health-appointments endpoint to force a refresh
        await fetch("/api/health-appointments", {
          method: "GET",
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
      } catch (error) {
        console.error("Error refreshing appointments cache:", error);
      }

      // Navigate back to appointments page
      router.push("/appointments");
      router.refresh(); // Force a full refresh of all Server Components
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      toast.error("Failed to schedule appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === currentStep
                    ? "bg-primary text-white"
                    : step < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step}
              </div>
              <span className="text-xs mt-1">
                {step === 1 ? "Doctor" : step === 2 ? "Date & Time" : "Confirm"}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-semibold mb-6">Select a Doctor</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Appointment Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Annual Checkup"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Select Specialty</Label>
                <Select
                  value={formData.specialty}
                  onValueChange={(value) =>
                    handleSelectChange("specialty", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctorId">Select Doctor</Label>
                <Select
                  value={formData.doctorId}
                  onValueChange={(value) =>
                    handleSelectChange("doctorId", value)
                  }
                  disabled={!formData.specialty}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        formData.specialty
                          ? "Select a doctor"
                          : "Select a specialty first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDoctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.hospital}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedDoctor && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedDoctor.hospital} -{" "}
                    {
                      LOCATIONS.find((l) => l.name === selectedDoctor.hospital)
                        ?.address
                    }
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Input
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Annual physical examination"
                  required
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-xl font-semibold mb-6">Select Date & Time</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-xl font-semibold mb-6">Confirm Details</h2>
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-muted-foreground">Title:</p>
                <p className="text-sm font-medium">{formData.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-muted-foreground">Specialty:</p>
                <p className="text-sm font-medium">{formData.specialty}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-muted-foreground">Doctor:</p>
                <p className="text-sm font-medium">
                  {selectedDoctor?.name || ""}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-muted-foreground">Location:</p>
                <p className="text-sm font-medium">
                  {selectedDoctor?.hospital || ""}
                  {selectedLocation && (
                    <span className="block text-xs text-muted-foreground">
                      {selectedLocation.address}
                    </span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-muted-foreground">Date:</p>
                <p className="text-sm font-medium">
                  {formData.date &&
                    new Date(formData.date).toLocaleDateString()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-muted-foreground">Time:</p>
                <p className="text-sm font-medium">{formData.time}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-muted-foreground">Reason:</p>
                <p className="text-sm font-medium">{formData.reason}</p>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/appointments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Schedule Appointment</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          {renderStepIndicator()}

          <div className="min-h-[300px]">{renderStepContent()}</div>

          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
              >
                Back
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/appointments")}
              >
                Cancel
              </Button>
            )}

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={goToNextStep}
                disabled={
                  (currentStep === 1 &&
                    (!formData.title ||
                      !formData.specialty ||
                      !formData.doctorId ||
                      !formData.reason)) ||
                  (currentStep === 2 && (!formData.date || !formData.time))
                }
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
