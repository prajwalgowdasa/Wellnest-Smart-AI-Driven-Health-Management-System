"use client";

import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Filter, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HealthRecord {
  id: string;
  title: string;
  record_type: string;
  doctor: string;
  date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export default function HealthRecordsPage() {
  const router = useRouter();
  const recordTypes = [
    "All Records",
    "Consultations",
    "Lab Results",
    "Imaging",
    "Medications",
    "Vaccinations",
  ];

  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("All Records");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchRecords() {
      try {
        const response = await fetch("/api/health-records");
        if (!response.ok) {
          throw new Error("Failed to fetch records");
        }
        const data = await response.json();
        setRecords(data);
      } catch (err) {
        console.error("Error fetching records:", err);
        setError("Failed to load health records. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, []);

  // Filter records based on selected type and search query
  const filteredRecords = records.filter((record) => {
    const matchesType =
      selectedType === "All Records" ||
      record.record_type.toLowerCase() === selectedType.toLowerCase();

    const matchesSearch =
      searchQuery === "" ||
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  // Function to handle viewing record details
  const handleViewDetails = (id: string) => {
    // Navigate to a detail page (we'll need to create this page later)
    router.push(`/health-records/${id}`);
  };

  // Function to handle downloading PDF
  const handleDownloadPDF = (record: HealthRecord) => {
    // In a real application, this would fetch a PDF from the server
    // For demonstration, we'll create a simple text representation
    const content = `
Health Record: ${record.title}
Doctor: ${record.doctor}
Date: ${new Date(record.date).toLocaleDateString()}
Type: ${record.record_type}
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Health Records</h1>
        <Link href="/health-records/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Record
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="w-full md:w-64">
          <CardHeader>
            <CardTitle className="text-xl">Record Types</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <ul className="space-y-1">
              {recordTypes.map((type, index) => (
                <li key={index}>
                  <Button
                    variant={type === selectedType ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search records..."
                className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <FileText className="mb-2 h-10 w-10 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No records found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || selectedType !== "All Records"
                  ? "Try changing your search or filter criteria"
                  : "Add your first health record to get started"}
              </p>
              {!searchQuery && selectedType === "All Records" && (
                <Link href="/health-records/add" className="mt-4">
                  <Button>Add Your First Record</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <Card key={record.id} className="overflow-hidden">
                  <div className="flex items-start gap-4 p-4 sm:p-6">
                    <div className="rounded-full bg-primary/10 p-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                          <h3 className="font-semibold">{record.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {record.doctor}
                          </p>
                        </div>
                        <p className="whitespace-nowrap text-sm font-medium">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <p className="mt-2 text-sm">{record.description}</p>
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(record.id)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadPDF(record)}
                        >
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
