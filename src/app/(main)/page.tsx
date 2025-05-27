"use client";

import { AddRecordDialog } from "@/components/add-record-dialog";
import { AddVitalDialog } from "@/components/add-vital-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getActiveMedications,
  getHealthRecords,
  getLatestVitalSigns,
  getRecentAIInsights,
  getUpcomingAppointments,
} from "@/lib/api";
import {
  Activity,
  BarChart,
  Calendar,
  FileText,
  Heart,
  Pill,
  Stethoscope,
} from "lucide-react";
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Health Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/login")}>
            Logout
          </Button>
          <AddRecordDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Appointment</p>
              <p className="text-lg sm:text-xl font-medium truncate">
                {nextAppointment ? formatDate(nextAppointment.date) : "None"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Recent Health Records</CardTitle>
                <Link href="/health-records">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-2">
              {recentRecords.length > 0 ? (
                <div className="space-y-2">
                  {recentRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{record.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {record.doctor}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/health-records/${record.id}`)
                        }
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-muted-foreground">No recent records</p>
                  <Link href="/health-records/add">
                    <Button variant="link">Add a record</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Appointments</CardTitle>
                <Link href="/appointments">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-2">
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-2">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg hover:bg-accent gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{appointment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.doctor}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-10 sm:ml-0">
                        <p className="text-sm">
                          {formatDate(appointment.date)}
                          {appointment.time && `, ${appointment.time}`}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/appointments/${appointment.id}`)
                          }
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-muted-foreground">
                    No upcoming appointments
                  </p>
                  <Link href="/appointments/schedule">
                    <Button variant="link">Schedule an appointment</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>AI Health Insights</CardTitle>
                <Link href="/ai-insights">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-2">
              {aiInsights.length > 0 ? (
                <div className="space-y-2">
                  {aiInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <BarChart className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {insight.content}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(insight.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-muted-foreground">No insights available</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Active Medications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-2">
              {medications.length > 0 ? (
                <div className="space-y-2">
                  {medications.map((medication, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Pill className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{medication.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {medication.dosage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-muted-foreground">No active medications</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
