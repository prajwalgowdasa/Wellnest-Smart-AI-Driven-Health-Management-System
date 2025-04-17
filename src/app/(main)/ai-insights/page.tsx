"use client";

import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAIInsights, triggerAIInsightsUpdate } from "@/lib/api";
import {
  Activity,
  BarChart2,
  Brain,
  Calendar,
  Heart,
  Loader2,
  RefreshCw,
  Scale,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Define TypeScript interfaces for our data
interface HealthRisk {
  id: string;
  category: string;
  name: string;
  level: "low" | "moderate" | "high" | "normal";
  description: string;
  icon: string;
}

interface HealthGoal {
  id: string;
  name: string;
  target: string;
  current: string;
  priority: number;
}

interface Recommendation {
  id: string;
  category: string;
  title: string;
  content: string;
}

interface AIInsightsData {
  healthRisks: HealthRisk[];
  healthGoals: HealthGoal[];
  recommendations: Recommendation[];
  lastUpdated?: string;
}

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<AIInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Helper function to get the icon component based on the icon name
  const getIconComponent = (
    iconName: string,
    className: string = "h-5 w-5"
  ) => {
    switch (iconName) {
      case "heart":
        return <Heart className={`${className} text-rose-500`} />;
      case "activity":
        return <Activity className={`${className} text-amber-500`} />;
      case "bar-chart-2":
        return <BarChart2 className={`${className} text-blue-500`} />;
      case "scale":
        return <Scale className={`${className} text-indigo-500`} />;
      default:
        return <Activity className={className} />;
    }
  };

  // Helper function to get the status badge color based on level
  const getStatusColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
      case "normal":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "moderate":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Function to fetch insights data
  const fetchInsights = async () => {
    try {
      setIsLoading(true);
      const data = await getAIInsights();
      setInsights(data as AIInsightsData);
    } catch (error) {
      console.error("Error fetching insights:", error);
      toast.error("Failed to load insights");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update insights
  const updateInsights = async () => {
    try {
      setIsUpdating(true);
      // Trigger a new insights generation on the backend
      const updateResponse = await triggerAIInsightsUpdate();

      // Check if there's new data returned directly from the update endpoint
      if (updateResponse.data) {
        // If the update endpoint generated new mock data, use it directly
        setInsights(updateResponse.data);
        toast.success("Insights updated successfully");
      } else {
        // Otherwise, fetch the latest data
        // Wait a moment for backend processing
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Fetch the newly generated insights
        await fetchInsights();
        toast.success("Insights updated successfully");
      }
    } catch (error: any) {
      console.error("Error updating insights:", error);
      // Even if there's an error, still try to refresh the data
      // as our backend fallback might have generated new insights
      try {
        await fetchInsights();
        toast.success("Insights refreshed with latest data");
      } catch (secondError) {
        toast.error("Failed to update insights");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Fetch insights on component mount
  useEffect(() => {
    fetchInsights();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading AI insights...</p>
        </div>
      </div>
    );
  }

  // If no insights data is available
  if (!insights) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Brain className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No insights available</h2>
          <p className="text-center text-muted-foreground">
            We don't have enough data to generate insights yet.
          </p>
          <Button onClick={updateInsights} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Health Insights</h1>
        <Button
          className="gap-2"
          onClick={updateInsights}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Update Analysis
            </>
          )}
        </Button>
      </div>

      <p className="text-muted-foreground">
        Powered by AI, these insights are generated based on your health
        records, activity patterns, and medical history. Always consult with
        healthcare professionals before making health decisions.
      </p>

      {insights.lastUpdated && (
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(insights.lastUpdated).toLocaleString()}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Brain className="h-6 w-6 text-primary" />
            <CardTitle>Health Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.healthRisks.map((risk) => (
                <div
                  key={risk.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {getIconComponent(risk.icon)}
                    <span>{risk.name}</span>
                  </div>
                  <div
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                      risk.level
                    )}`}
                  >
                    {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Calendar className="h-6 w-6 text-primary" />
            <CardTitle>Upcoming Health Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.healthGoals.map((goal) => (
                <div key={goal.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                    {goal.priority}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{goal.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Target: {goal.target}{" "}
                      {goal.current && `(currently ${goal.current})`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Utensils className="h-6 w-6 text-primary" />
            <CardTitle>Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.recommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="rounded-lg bg-muted p-4"
                >
                  <h4 className="mb-2 font-medium">{recommendation.title}</h4>
                  <p className="text-sm">{recommendation.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
