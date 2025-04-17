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

export async function GET() {
  try {
    // Get all health records from DRF API
    const response = await api.get("/health/records/");

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to fetch health records:", error);
    return NextResponse.json(
      { error: "Failed to fetch health records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
