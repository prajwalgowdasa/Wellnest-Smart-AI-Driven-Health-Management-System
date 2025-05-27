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
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getHealthRecord } from "@/lib/api";
import { format } from "date-fns";

interface HealthRecord {
  id: string;
  title: string;
  record_type: string;
  doctor: string;
  date: string;
  description: string;
  file?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
}

export default function RecordDetailsPage() {
  const params = useParams();
  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const recordId = params?.id as string;

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await getHealthRecord(recordId);
        setRecord(data);
        setPreviewError(null);
      } catch (error) {
        toast.error('Failed to load record');
        setPreviewError('Failed to load record');
      } finally {
        setLoading(false);
      }
    };

    if (recordId) {
      fetchRecord();
    }
  }, [recordId]);

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/health-records/${recordId}/file`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download file');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${record?.title || 'document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      toast.error(error.message || 'Failed to download file');
    }
  };

  const handlePrint = async () => {
    try {
      const response = await fetch(`/api/health-records/${recordId}/file`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load file for printing');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      
      iframe.onload = () => {
        try {
          iframe.contentWindow?.print();
        } catch (error) {
          toast.error('Failed to print file');
        }
        // Clean up after printing
        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(iframe);
        }, 1000);
      };
    } catch (error: any) {
      toast.error(error.message || 'Failed to print file');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Record not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/health-records">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Record Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrint} variant="outline" disabled={!record.file}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload} variant="outline" disabled={!record.file}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Link href={`/health-records/${record.id}/edit`}>
            <Button variant="default">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Record Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Title</h3>
              <p>{record.title}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Record Type</h3>
              <p className="capitalize">{record.record_type.replace('_', ' ')}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Healthcare Provider</h3>
              <p>{record.doctor}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Date</h3>
              <p>{format(new Date(record.date), 'PPP')}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Description</h3>
              <p className="whitespace-pre-wrap">{record.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 min-h-[500px] flex items-center justify-center">
              {record.file ? (
                <iframe
                  src={`/api/health-records/${recordId}/file`}
                  className="w-full h-[500px] border-0"
                  title="Document Preview"
                  onError={() => setPreviewError('Failed to load document preview')}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No document uploaded</p>
                </div>
              )}
              {previewError && (
                <div className="text-center text-red-500">
                  <p>{previewError}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
