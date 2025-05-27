import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/db";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const id = await Promise.resolve(params.id);

  try {
    // First check if the record exists and has a file
    const recordResponse = await apiClient.get(`/health/records/${id}/`);
    const record = recordResponse.data;

    if (!record.file) {
      return new NextResponse(
        JSON.stringify({
          error: "No file attached to this record. Please upload a file first."
        }), 
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Get the file from the Django backend
    const response = await apiClient.get(record.file, {
      responseType: "arraybuffer",
      headers: {
        'Accept': '*/*',
      },
    });

    // Get the content type from the response
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    const filename = record.file.split('/').pop() || 'document';
    
    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Error fetching file:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to fetch file", 
        details: error.message 
      }), 
      { 
        status: error.response?.status || 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 