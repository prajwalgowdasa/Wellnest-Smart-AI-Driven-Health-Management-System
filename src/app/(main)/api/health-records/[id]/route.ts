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

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = params.id;

    // Get the health record by ID from DRF API - use apiClient for consistency
    const response = await apiClient.get(`/health/records/${id}/`);

    return NextResponse.json(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;

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

    // Delete the health record using DRF API
    await apiClient.delete(`/health/records/${id}/`);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const axiosError = error as AxiosError;

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
