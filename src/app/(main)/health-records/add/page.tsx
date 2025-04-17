"use client";

import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createHealthRecord } from "@/lib/api";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AddRecordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setValidationErrors({});

    // Get form data
    const formData = new FormData(e.currentTarget);
    const date = formData.get("date") as string;

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      setValidationErrors({
        date: "Date has wrong format. Use one of these formats instead: YYYY-MM-DD.",
      });
      setIsSubmitting(false);
      return;
    }

    const record = {
      title: formData.get("title") as string,
      recordType: formData.get("recordType") as string,
      doctor: formData.get("doctor") as string,
      date: date,
      description: formData.get("description") as string,
    };

    try {
      // Submit the record using the API
      await createHealthRecord(record);

      // Show success notification
      toast.success("Health record created successfully");

      // Redirect to records page on success
      router.push("/health-records");
      router.refresh(); // Refresh server components
    } catch (err: any) {
      console.error("Error submitting record:", err);

      // Check for validation errors in the response
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred. Please try again later."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);

    // Clear date validation error when user changes the date
    if (validationErrors.date) {
      setValidationErrors((prev) => ({
        ...prev,
        date: undefined,
      }));
    }
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
                {validationErrors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {validationErrors.title}
                  </p>
                )}
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
                {validationErrors.recordType && (
                  <p className="text-sm text-red-500 mt-1">
                    {validationErrors.recordType}
                  </p>
                )}
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
                  required
                />
                {validationErrors.doctor && (
                  <p className="text-sm text-red-500 mt-1">
                    {validationErrors.doctor}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className={`w-full rounded-md border ${
                    validationErrors.date ? "border-red-500" : "border-input"
                  } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                  value={selectedDate}
                  onChange={handleDateChange}
                  required
                />
                {validationErrors.date && (
                  <p className="text-sm text-red-500 mt-1">
                    {validationErrors.date}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Format: YYYY-MM-DD
                </p>
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
