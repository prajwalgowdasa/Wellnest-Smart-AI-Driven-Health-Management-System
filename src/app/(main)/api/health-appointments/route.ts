import { apiClient } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Ensure this is never cached

export async function GET() {
  try {
    console.log(
      "Fetching appointments from:",
      apiClient.defaults.baseURL + "/health/appointments/"
    );

    // Fetch appointments from the DRF API
    const response = await apiClient.get("/health/appointments/");
    console.log("Successfully fetched appointments:", {
      status: response.status,
      dataLength: response.data?.length || 0,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch appointments:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return NextResponse.json(
      {
        error: "Failed to fetch appointments",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
