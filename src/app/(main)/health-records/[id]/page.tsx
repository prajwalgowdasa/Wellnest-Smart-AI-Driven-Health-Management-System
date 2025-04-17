"use client";

import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  Edit,
  FileText,
  Printer,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HealthRecord {
  id: string;
  title: string;
  recordType: string;
  doctor: string;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function RecordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);

  async function fetchRecord() {
    try {
      const response = await fetch(`/api/health-records/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Record not found");
        }
        throw new Error("Failed to fetch record");
      }

      const data = await response.json();
      setRecord(data);
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
    setLoading(true);
    await fetchRecord();
  };

  // Function to handle downloading PDF
  const handleDownloadPDF = () => {
    if (!record) return;

    // In a real application, this would fetch a PDF from the server
    // For demonstration, we'll create a simple text representation
    const content = `
Health Record: ${record.title}
Doctor: ${record.doctor}
Date: ${new Date(record.date).toLocaleDateString()}
Type: ${record.recordType}
Description: ${record.description}
    `.trim();

    // Create a blob and download it
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${record.title.replace(/\s+/g, "_")}_record.txt`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/health-records">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Record Details</h1>
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
              <Link href="/health-records">
                <Button variant="outline">Return to Health Records</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : record ? (
        <div className="space-y-6 print:space-y-4">
          {/* Actions */}
          <div className="flex justify-end gap-2 print:hidden">
            <Link href={`/health-records/${id}/edit`}>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" className="gap-2" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleDownloadPDF}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>

          {/* Header Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{record.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {record.doctor}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {new Date(record.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {record.recordType}
                </p>
              </div>
            </CardHeader>
          </Card>

          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{record.description}</p>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle>Record Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Record ID
                  </p>
                  <p className="font-mono text-sm">{record.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Record Type
                  </p>
                  <p className="capitalize">{record.recordType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created
                  </p>
                  <p>
                    {new Date(record.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </p>
                  <p>
                    {new Date(record.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="rounded-md bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
          Record not found.
          <div className="mt-4">
            <Link href="/health-records">
              <Button>Return to Health Records</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
