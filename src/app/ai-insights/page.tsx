"use client";

import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  BarChart2,
  Brain,
  Calendar,
  Heart,
  RefreshCw,
  Scale,
  Utensils,
} from "lucide-react";

export default function AIInsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Health Insights</h1>
        <Button className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Update Analysis
        </Button>
      </div>

      <p className="text-muted-foreground">
        Powered by AI, these insights are generated based on your health
        records, activity patterns, and medical history. Always consult with
        healthcare professionals before making health decisions.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Brain className="h-6 w-6 text-primary" />
            <CardTitle>Health Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  <span>Cardiovascular Risk</span>
                </div>
                <div className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Low
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-amber-500" />
                  <span>Metabolic Risk</span>
                </div>
                <div className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  Moderate
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-blue-500" />
                  <span>Stress Level</span>
                </div>
                <div className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  Moderate
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-indigo-500" />
                  <span>BMI Status</span>
                </div>
                <div className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Normal
                </div>
              </div>
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
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium">Increase daily steps</p>
                  <p className="text-sm text-muted-foreground">
                    Target: 8,000 steps daily (currently 5,460)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium">Reduce sodium intake</p>
                  <p className="text-sm text-muted-foreground">
                    Target: &lt;2,300mg daily
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium">Sleep improvement</p>
                  <p className="text-sm text-muted-foreground">
                    Target: 7-8 hours of quality sleep
                  </p>
                </div>
              </div>
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
              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 font-medium">Diet Suggestions</h4>
                <p className="text-sm">
                  Based on your recent blood test results, consider increasing
                  foods rich in iron and vitamin B12 such as lean meats, beans,
                  and leafy greens. Your ferritin levels are slightly below
                  optimal range.
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 font-medium">Exercise Recommendations</h4>
                <p className="text-sm">
                  Your cardiovascular fitness has improved by 12% in the last 3
                  months. Consider adding 2 days of strength training to your
                  current routine to improve muscle mass and metabolic health.
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 font-medium">Sleep Optimization</h4>
                <p className="text-sm">
                  Your sleep data shows disrupted sleep between 2-4 AM. Consider
                  limiting fluid intake 2 hours before bedtime and maintaining a
                  consistent sleep schedule to improve sleep quality.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
