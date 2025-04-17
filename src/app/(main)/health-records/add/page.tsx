"use client";

import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createHealthRecord, getDoctorAvailability } from "@/lib/api";
import { ArrowLeft, Clock, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TimeSlot = {
  id: string;
  start_time: string;
  end_time: string;
  available: boolean;
};

export default function AddRecordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);

  // Load time slots when date or doctor changes
  useEffect(() => {
    const loadTimeSlots = async () => {
      if (selectedDate && selectedDoctor) {
        setIsLoadingTimeSlots(true);
        try {
          const slots = await getDoctorAvailability(
            selectedDoctor,
            selectedDate
          );
          setTimeSlots(slots);
        } catch (error) {
          console.error("Error loading time slots:", error);
        } finally {
          setIsLoadingTimeSlots(false);
        }
      }
    };

    loadTimeSlots();
  }, [selectedDate, selectedDoctor]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Get form data
    const formData = new FormData(e.currentTarget);
    const record = {
      title: formData.get("title") as string,
      recordType: formData.get("recordType") as string,
      doctor: formData.get("doctor") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      description: formData.get("description") as string,
    };

    try {
      // Submit the record using the API
      await createHealthRecord(record);

      // Redirect to records page on success
      router.push("/health-records");
      router.refresh(); // Refresh server components
    } catch (error) {
      console.error("Error submitting record:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An unknown error occurred. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDoctor(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/health-records">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Health Record</h1>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Record Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Record Title
                </label>
                <input
                  id="title"
                  name="title"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="e.g., Annual Physical"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="recordType" className="text-sm font-medium">
                  Record Type
                </label>
                <select
                  id="recordType"
                  name="recordType"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="">Select Record Type</option>
                  <option value="consultation">Consultation</option>
                  <option value="lab_test">Lab Test</option>
                  <option value="imaging">Imaging</option>
                  <option value="medication">Medication</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="doctor" className="text-sm font-medium">
                  Healthcare Provider
                </label>
                <input
                  id="doctor"
                  name="doctor"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="e.g., Dr. Sarah Johnson"
                  value={selectedDoctor}
                  onChange={handleDoctorChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  defaultValue={selectedDate}
                  onChange={handleDateChange}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label htmlFor="time" className="text-sm font-medium">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {isLoadingTimeSlots ? (
                    <div className="col-span-full flex items-center justify-center py-4">
                      <Clock className="animate-spin h-4 w-4 mr-2" />
                      <span>Loading available times...</span>
                    </div>
                  ) : timeSlots.length > 0 ? (
                    timeSlots.map((slot) => (
                      <label
                        key={slot.id}
                        className={`
                          flex items-center justify-center p-2 rounded border 
                          ${
                            slot.available
                              ? selectedTimeSlot === slot.start_time
                                ? "bg-primary text-primary-foreground"
                                : "bg-background hover:bg-accent cursor-pointer"
                              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="time"
                          value={slot.start_time}
                          className="sr-only"
                          disabled={!slot.available}
                          checked={selectedTimeSlot === slot.start_time}
                          onChange={() => setSelectedTimeSlot(slot.start_time)}
                        />
                        {slot.start_time}
                      </label>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-muted-foreground py-4">
                      {selectedDoctor && selectedDate
                        ? "No available time slots for this date and provider"
                        : "Select a healthcare provider and date to see available times"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Enter details about this health record..."
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="fileUpload" className="text-sm font-medium">
                Upload Documents (optional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="fileUpload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent/50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG, PNG (MAX. 10MB)
                    </p>
                  </div>
                  <input
                    id="fileUpload"
                    name="fileUpload"
                    type="file"
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/health-records">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Record"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
