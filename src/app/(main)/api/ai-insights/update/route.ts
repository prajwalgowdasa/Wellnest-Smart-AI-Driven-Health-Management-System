import { NextRequest, NextResponse } from "next/server";
import { generateMockInsights, updateLatestMockInsights } from "../utils";

export const dynamic = "force-dynamic"; // Ensure this is never cached

export async function POST(request: NextRequest) {
  try {
    console.log("Triggering AI insights update");

    // Generate new mock data - skip the attempt to call backend endpoint
    const mockData = generateMockInsights();

    // Store it in the shared variable via the helper function
    updateLatestMockInsights(mockData);

    // Store this data where the GET endpoint can find it
    // We'll use cookies since Next.js API routes are stateless
    const response = NextResponse.json({
      success: true,
      message: "AI insights update simulation completed successfully",
      data: mockData,
    });

    // Set a cookie with the timestamp so the GET endpoint knows there's fresh data
    response.cookies.set("ai_insights_updated", "true", {
      maxAge: 60 * 5, // 5 minutes
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Failed to generate AI insights:", {
      message: error.message,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate AI insights",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
