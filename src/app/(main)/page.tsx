"use client";

import { AddRecordDialog } from "@/components/add-record-dialog";
import { AddVitalDialog } from "@/components/add-vital-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getActiveMedications,
  getHealthRecords,
  getLatestVitalSigns,
  getRecentAIInsights,
  getUpcomingAppointments,
} from "@/lib/api";
import { Activity, Heart, Pill, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HealthRecord {
  id: string;
  title: string;
  record_type: string;
  doctor: string;
  date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface AIInsight {
  id: string;
  type: string;
  category: string;
  content: string;
  priority: string | null;
  created_at: string;
}

interface VitalSign {
  heart_rate: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  temperature: number;
}

interface Medication {
  name: string;
  dosage: string;
}

interface Appointment {
  id: string;
  title: string;
  doctor: string;
  date: string;
  time?: string;
  location?: string;
  status?: "upcoming" | "completed" | "cancelled";
  notes?: string;
}

export default function Home() {
  const router = useRouter();
  const [recentRecords, setRecentRecords] = useState<HealthRecord[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSign | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(
    null
  );
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showAllAppointments, setShowAllAppointments] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [records, vitals, meds, appointments, insights] =
          await Promise.all([
            getHealthRecords(),
            getLatestVitalSigns().catch(() => null),
            getActiveMedications().catch(() => []),
            getUpcomingAppointments().catch(() => []),
            getRecentAIInsights().catch(() => []),
          ]);

        setRecentRecords(records.slice(0, 3));
        setVitalSigns(vitals);
        setMedications(meds);

        // Sort appointments by date (earliest first) if there are any
        if (appointments && appointments.length > 0) {
          const sortedAppointments = [...appointments].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          // Filter to only show upcoming appointments
          const upcomingAppts = sortedAppointments.filter(
            (appt) => appt.status === "upcoming" || appt.status === undefined
          );

          setNextAppointment(upcomingAppts[0] || null);
          setUpcomingAppointments(upcomingAppts.slice(0, 3)); // Store top 3 upcoming appointments
        } else {
          setNextAppointment(null);
          setUpcomingAppointments([]);
        }

        setAiInsights(insights);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Health Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/login")}>
            Logout
          </Button>
          <AddRecordDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Heart Rate</p>
                <p className="text-2xl font-medium">
                  {vitalSigns?.heart_rate || "--"} BPM
                </p>
              </div>
            </div>
            <AddVitalDialog />
          </div>
        </Card>

        <Card className="p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Pressure</p>
                <p className="text-2xl font-medium">
                  {vitalSigns
                    ? `${vitalSigns.blood_pressure_systolic}/${vitalSigns.blood_pressure_diastolic}`
                    : "--/--"}
                </p>
              </div>
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
              <p className="text-2xl font-medium">{medications.length} Today</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Checkup</p>
                <p className="text-2xl font-medium">
                  {nextAppointment ? formatDate(nextAppointment.date) : "--"}
                </p>
                {nextAppointment && (
                  <p className="text-xs text-muted-foreground">
                    Dr. {nextAppointment.doctor}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-9 w-9 rounded-full p-0"
                onClick={() => router.push("/appointments/schedule")}
              >
                <Stethoscope className="h-4 w-4" />
                <span className="sr-only">Schedule Appointment</span>
              </Button>
              <Link
                href="/appointments"
                className="text-xs text-primary hover:underline"
              >
                View all
              </Link>
              {upcomingAppointments.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-6 text-xs text-muted-foreground"
                  onClick={() => setShowAllAppointments(!showAllAppointments)}
                >
                  {showAllAppointments
                    ? "Hide"
                    : `+${upcomingAppointments.length - 1} more`}
                </Button>
              )}
            </div>
          </div>

          {/* Expandable upcoming appointments */}
          {showAllAppointments && upcomingAppointments.length > 1 && (
            <div className="border-t mt-3 pt-3 space-y-2">
              {upcomingAppointments.slice(1).map((appointment, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">
                      Dr. {appointment.doctor}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      {new Date(appointment.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(appointment.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">AI Health Insights</h2>
          <div className="space-y-4">
            {aiInsights.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                No AI insights available yet.
              </div>
            ) : (
              aiInsights.map((insight) => (
                <div key={insight.id} className="rounded-lg bg-muted p-4">
                  <p className="text-sm">{insight.content}</p>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 text-right">
            <Link href="/ai-insights">
              <Button variant="outline" size="sm">
                View All Insights
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Recent Records</h2>
          <div className="space-y-4">
            {recentRecords.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                No health records found. Add your first record.
              </div>
            ) : (
              recentRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{record.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(record.date)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/health-records/${record.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 text-right">
            <Link href="/health-records">
              <Button variant="outline" size="sm">
                View All Records
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
