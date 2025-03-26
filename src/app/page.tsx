import { Button } from "@/components/button";
import { Card } from "@/components/ui/card";
import { Activity, Heart, Pill, Plus, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Health Dashboard</h1>
        <Link href="/health-records/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Heart Rate</p>
              <p className="text-2xl font-medium">72 BPM</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Blood Pressure</p>
              <p className="text-2xl font-medium">120/80</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Pill className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Medication</p>
              <p className="text-2xl font-medium">2 Today</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Checkup</p>
              <p className="text-2xl font-medium">May 15</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">AI Health Insights</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm">
                Based on your recent blood pressure readings, consider reducing
                sodium intake and increasing potassium-rich foods in your diet.
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm">
                Your sleep pattern shows improvement. Continue with your current
                sleep hygiene practices.
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm">
                Reminder: Your annual physical examination is due in 2 weeks.
                Schedule an appointment soon.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Recent Records</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Blood Test Results</p>
                <p className="text-sm text-muted-foreground">May 1, 2024</p>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Cardiology Consultation</p>
                <p className="text-sm text-muted-foreground">April 22, 2024</p>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Physical Therapy Session</p>
                <p className="text-sm text-muted-foreground">April 15, 2024</p>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
