import { apiClient } from "@/lib/db"; // Use the consistent apiClient
import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

// Base URL for Django REST Framework API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Force dynamic to prevent potential static optimization issues with dynamic routes
export const dynamic = "force-dynamic";

// Mock health records data for individual records
const MOCK_HEALTH_RECORDS_BY_ID = {
  "1": {
    id: "1",
    title: "Annual Physical Examination",
    record_type: "consultation",
    doctor: "Dr. Sarah Johnson",
    date: "2023-06-15T09:30:00",
    description:
      "Regular annual physical examination. Blood pressure normal. Recommended routine blood work.",
  },
  "2": {
    id: "2",
    title: "Blood Test Results",
    record_type: "lab_test",
    doctor: "Dr. Michael Chen",
    date: "2023-07-10T14:15:00",
    description:
      "Complete blood count and metabolic panel. All results within normal range.",
  },
  "3": {
    id: "3",
    title: "Chest X-Ray",
    record_type: "imaging",
    doctor: "Dr. James Wilson",
    date: "2023-08-05T11:00:00",
    description:
      "Chest X-ray to follow up on previous bronchitis. Lungs clear.",
  },
  "4": {
    id: "4",
    title: "Flu Vaccination",
    record_type: "vaccination",
    doctor: "Nurse Emily Thompson",
    date: "2023-10-01T15:45:00",
    description: "Annual influenza vaccination, standard dose.",
  },
  "5": {
    id: "5",
    title: "Prescription Renewal",
    record_type: "medication",
    doctor: "Dr. Sarah Johnson",
    date: "2023-10-20T10:00:00",
    description: "Renewal of maintenance medications for 3 months.",
  },
};

// Helper to get a generic mock record for any ID not in our predefined list
function getMockRecordById(id: string) {
  // Return from predefined list if available
  if (MOCK_HEALTH_RECORDS_BY_ID[id]) {
    return MOCK_HEALTH_RECORDS_BY_ID[id];
  }

  // Generate a generic record for this ID
  return {
    id,
    title: `Health Record ${id}`,
    record_type: "consultation",
    doctor: "Dr. Example",
    date: new Date().toISOString().split("T")[0],
    description: "This is a mock health record.",
  };
}

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = params.id;

    // Return mock data if environment variable is set
    if (
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
      process.env.NEXT_PUBLIC_USE_MOCK_HEALTH_RECORDS === "true"
    ) {
      console.log(`Using mock data for health record ID: ${id}`);
      return NextResponse.json(getMockRecordById(id));
    }

    // Get the health record by ID from DRF API - use apiClient for consistency
    const response = await apiClient.get(`/health/records/${id}/`);

    return NextResponse.json(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;

    // If we're using mock data, return a mock record even for errors
    if (
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
      process.env.NEXT_PUBLIC_USE_MOCK_HEALTH_RECORDS === "true"
    ) {
      console.log(`Returning mock data for health record ID: ${params.id}`);
      return NextResponse.json(getMockRecordById(params.id));
    }

    // Handle 404 not found case
    if (axiosError.response?.status === 404) {
      return NextResponse.json(
        { error: "Health record not found" },
        { status: 404 }
      );
    }

    console.error(`Failed to fetch health record:`, error);
    return NextResponse.json(
      { error: "Failed to fetch health record" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const id = params.id;
    const body = await request.json();

    // Handle mock data case
    if (
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
      process.env.NEXT_PUBLIC_USE_MOCK_HEALTH_RECORDS === "true"
    ) {
      console.log(`Mock update for health record ID: ${id}`);

      // Create an updated mock record
      const updatedRecord = {
        id,
        title: body.title,
        record_type: body.recordType || body.record_type,
        doctor: body.doctor,
        date: body.date,
        description: body.description,
        ...(body.additionalData || {}),
      };

      return NextResponse.json(updatedRecord);
    }

    // Update the health record using DRF API
    const response = await apiClient.put(`/health/records/${id}/`, {
      title: body.title,
      record_type: body.recordType,
      doctor: body.doctor,
      date: body.date,
      description: body.description,
      // Any additional fields from the request
      ...body.additionalData,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;

    // If we're using mock data, return a mock success response
    if (
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
      process.env.NEXT_PUBLIC_USE_MOCK_HEALTH_RECORDS === "true"
    ) {
      try {
        const body = await request.json();
        const updatedRecord = {
          id: params.id,
          title: body.title,
          record_type: body.recordType || body.record_type,
          doctor: body.doctor,
          date: body.date,
          description: body.description,
          ...(body.additionalData || {}),
        };
        return NextResponse.json(updatedRecord);
      } catch (parseError) {
        // Return generic updated record
        return NextResponse.json(getMockRecordById(params.id));
      }
    }

    // Handle 404 not found case
    if (axiosError.response?.status === 404) {
      return NextResponse.json(
        { error: "Health record not found" },
        { status: 404 }
      );
    }

    // Get more detailed error if available
    const errorMessage =
      axiosError.response?.data?.detail || "Failed to update health record";
    const statusCode = axiosError.response?.status || 500;

    console.error(`Failed to update health record:`, error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const id = params.id;

    // Handle mock data case
    if (
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
      process.env.NEXT_PUBLIC_USE_MOCK_HEALTH_RECORDS === "true"
    ) {
      console.log(`Mock delete for health record ID: ${id}`);
      return new NextResponse(null, { status: 204 });
    }

    // Delete the health record using DRF API
    await apiClient.delete(`/health/records/${id}/`);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const axiosError = error as AxiosError;

    // If we're using mock data, return a success response
    if (
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
      process.env.NEXT_PUBLIC_USE_MOCK_HEALTH_RECORDS === "true"
    ) {
      return new NextResponse(null, { status: 204 });
    }

    // Handle 404 not found case
    if (axiosError.response?.status === 404) {
      return NextResponse.json(
        { error: "Health record not found" },
        { status: 404 }
      );
    }

    console.error(`Failed to delete health record:`, error);
    return NextResponse.json(
      { error: "Failed to delete health record" },
      { status: 500 }
    );
  }
}
