import { NextRequest, NextResponse } from "next/server";
import { getLatestMockInsights, MOCK_INSIGHTS } from "./utils";

export const dynamic = "force-dynamic"; // Ensure this is never cached

export async function GET(request: NextRequest) {
  try {
    // Check if we have new mock data from an update request
    const insightsUpdated = request.cookies.get("ai_insights_updated");

    if (insightsUpdated?.value === "true" && getLatestMockInsights()) {
      console.log("Using recently updated mock insights data");
      // Clear the cookie
      const response = NextResponse.json(getLatestMockInsights());
      response.cookies.set("ai_insights_updated", "", {
        maxAge: 0,
        path: "/",
      });
      return response;
    }

    // For deployment, prioritize mock data
    // Return the mock data directly
    return NextResponse.json(getLatestMockInsights() || MOCK_INSIGHTS);
  } catch (error: any) {
    console.error("Error handling AI insights request:", {
      message: error.message,
    });

    // Return mock data on error as fallback
    console.log("Error occurred, returning mock insights");
    return NextResponse.json(getLatestMockInsights() || MOCK_INSIGHTS);
  }
}
