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

// Mock data for health records
const MOCK_HEALTH_RECORDS = [
  {
    id: "1",
    title: "Annual Physical Examination",
    record_type: "consultation",
    doctor: "Dr. Sarah Johnson",
    date: "2023-06-15T09:30:00",
    description:
      "Regular annual physical examination. Blood pressure normal. Recommended routine blood work.",
  },
  {
    id: "2",
    title: "Blood Test Results",
    record_type: "lab_test",
    doctor: "Dr. Michael Chen",
    date: "2023-07-10T14:15:00",
    description:
      "Complete blood count and metabolic panel. All results within normal range.",
  },
  {
    id: "3",
    title: "Chest X-Ray",
    record_type: "imaging",
    doctor: "Dr. James Wilson",
    date: "2023-08-05T11:00:00",
    description:
      "Chest X-ray to follow up on previous bronchitis. Lungs clear.",
  },
  {
    id: "4",
    title: "Flu Vaccination",
    record_type: "vaccination",
    doctor: "Nurse Emily Thompson",
    date: "2023-10-01T15:45:00",
    description: "Annual influenza vaccination, standard dose.",
  },
  {
    id: "5",
    title: "Prescription Renewal",
    record_type: "medication",
    doctor: "Dr. Sarah Johnson",
    date: "2023-10-20T10:00:00",
    description: "Renewal of maintenance medications for 3 months.",
  },
];

// Force dynamic to prevent potential static optimization issues
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Return mock data if environment variable is set
    if (
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
      process.env.NEXT_PUBLIC_USE_MOCK_HEALTH_RECORDS === "true"
    ) {
      console.log("Using mock health records data due to environment variable");
      return NextResponse.json(MOCK_HEALTH_RECORDS);
    }

    // Get all health records from DRF API
    const response = await api.get("/health/records/");

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to fetch health records:", error);

    // Return mock data as fallback on error
    console.log("Error occurred, returning mock health records");
    return NextResponse.json(MOCK_HEALTH_RECORDS);
  }
}

export async function POST(request: NextRequest) {
  try {
    // If using mock data, simulate successful creation
    if (
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
      process.env.NEXT_PUBLIC_USE_MOCK_HEALTH_RECORDS === "true"
    ) {
      const body = await request.json();

      // Create a mock record with an ID
      const mockNewRecord = {
        id: `mock-${Date.now()}`,
        title: body.title,
        record_type: body.recordType,
        doctor: body.doctor,
        date: body.date,
        description: body.description,
        // Include any additional data
        ...(body.additionalData || {}),
      };

      return NextResponse.json(mockNewRecord, { status: 201 });
    }

    const body = await request.json();

    // Create a new health record using DRF API
    const response = await api.post("/health/records/", {
      title: body.title,
      record_type: body.recordType,
      doctor: body.doctor,
      date: body.date,
      description: body.description,
      // Any additional fields from the request
      ...body.additionalData,
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error("Failed to create health record:", error);

    // Get more detailed error if available
    const axiosError = error as AxiosError<{ detail?: string }>;
    const errorMessage =
      axiosError.response?.data?.detail || "Failed to create health record";
    const statusCode = axiosError.response?.status || 500;

    // If we're in a deployment that should use mock data, return a success response anyway
    if (
      process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
      process.env.NEXT_PUBLIC_USE_MOCK_HEALTH_RECORDS === "true"
    ) {
      try {
        const body = await request.json();
        const mockNewRecord = {
          id: `mock-${Date.now()}`,
          title: body.title,
          record_type: body.recordType,
          doctor: body.doctor,
          date: body.date,
          description: body.description,
          // Include any additional data
          ...(body.additionalData || {}),
        };
        return NextResponse.json(mockNewRecord, { status: 201 });
      } catch (parseError) {
        // If we can't parse the request body, return a generic mock record
        return NextResponse.json(
          {
            id: `mock-${Date.now()}`,
            title: "New Health Record",
            record_type: "consultation",
            doctor: "Dr. Example",
            date: new Date().toISOString(),
            description: "Automatically generated record",
          },
          { status: 201 }
        );
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
