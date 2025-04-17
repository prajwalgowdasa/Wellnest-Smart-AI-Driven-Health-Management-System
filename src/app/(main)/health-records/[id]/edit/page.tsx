"use client";

import { Button } from "@/components/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, Save, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface HealthRecord {
  id: string;
  title: string;
  record_type: string;
  doctor: string;
  date: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export default function EditRecordPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    record_type: "",
    doctor: "",
    date: "",
    description: "",
  });

  async function fetchRecord() {
    try {
      setLoading(true);
      const response = await fetch(`/api/health-records/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Record not found");
        }
        throw new Error("Failed to fetch record");
      }

      const data = await response.json();
      setRecord(data);
      setFormData({
        title: data.title || "",
        record_type: data.record_type || "",
        doctor: data.doctor || "",
        date: data.date ? data.date.split("T")[0] : "",
        description: data.description || "",
      });
      setError("");
    } catch (err) {
      console.error("Error fetching record:", err);
      setError(err instanceof Error ? err.message : "Failed to load record");
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const handleRetry = async () => {
    setIsRetrying(true);
    await fetchRecord();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/health-records/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          record_type: formData.record_type,
          doctor: formData.doctor,
          date: formData.date,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update record");
      }

      toast.success("Record updated successfully");
      router.push(`/health-records/${id}`);
    } catch (err) {
      console.error("Error updating record:", err);
      setError(err instanceof Error ? err.message : "Failed to update record");
      toast.error("Failed to update record");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/health-records/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete record");
      }

      toast.success("Record deleted successfully");
      router.push("/health-records");
    } catch (err) {
      console.error("Error deleting record:", err);
      setError(err instanceof Error ? err.message : "Failed to delete record");
      toast.error("Failed to delete record");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/health-records/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Record</h1>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="gap-2"
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4" />
              Delete Record
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                health record and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <div className="flex flex-col gap-4">
            <p>{error}</p>
            <div className="flex gap-3">
              <Button
                onClick={handleRetry}
                disabled={isRetrying}
                className="gap-2"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Retry
                  </>
                )}
              </Button>
              <Link href={`/health-records/${id}`}>
                <Button variant="outline">Return to Record</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Record Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Record Title
                    </label>
                    <input
                      id="title"
                      name="title"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="record_type"
                      className="text-sm font-medium"
                    >
                      Record Type
                    </label>
                    <select
                      id="record_type"
                      name="record_type"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.record_type}
                      onChange={handleInputChange}
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
                      value={formData.doctor}
                      onChange={handleInputChange}
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
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Link href={`/health-records/${id}`}>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" className="gap-2" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
