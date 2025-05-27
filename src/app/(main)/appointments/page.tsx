"use client";

import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppointments } from "@/lib/api";
import { Calendar, Clock, Plus, User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Appointment {
  id: string;
  title: string;
  doctor: string;
  date: string;
  time?: string;
  location: string;
  purpose?: string;
  status: "upcoming" | "completed" | "cancelled";
  notes?: string;
}

export default function AppointmentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<
    "all" | "upcoming" | "completed" | "cancelled"
  >("all");

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const data = await getAppointments();

        // Format the appointments from API
        const formattedAppointments = data.map((apt: any) => {
          // Extract time from date if available
          const dateObj = new Date(apt.date);
          const time = dateObj.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

          return {
            id: apt.id.toString(),
            title: apt.title || "Appointment", // Default if title not provided
            doctor: apt.doctor,
            date: apt.date,
            time: time,
            location: apt.location,
            purpose: apt.purpose,
            status: apt.status || "upcoming", // Default to upcoming if not specified
            notes: apt.notes,
          };
        });

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        // If API fails, show empty state
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments based on status
  const filteredAppointments = appointments.filter(
    (appointment) => filter === "all" || appointment.status === filter
  );

  // Function to cancel an appointment
  const handleCancelAppointment = async (id: string) => {
    // Optimistically update UI
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: "cancelled" as const } : apt
      )
    );

    // TODO: Update cancelled status on backend via API
    try {
      // Implement API call to update appointment status
      // await updateAppointmentStatus(id, "cancelled");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      // Revert on error
      setAppointments(appointments);
    }
  };

  // Helper function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <Link href="/appointments/schedule">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Schedule Appointment
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "upcoming" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("upcoming")}
        >
          Upcoming
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("completed")}
        >
          Completed
        </Button>
        <Button
          variant={filter === "cancelled" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("cancelled")}
        >
          Cancelled
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">
              Loading appointments...
            </p>
          </CardContent>
        </Card>
      ) : filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-medium">No appointments found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "all"
                ? "Schedule your first appointment to get started"
                : "No appointments match the selected filter"}
            </p>
            {filter === "all" && (
              <Link href="/appointments/schedule" className="mt-4">
                <Button>Schedule Appointment</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden">
              <div className="flex items-start gap-4 p-4 sm:p-6">
                <div
                  className={`rounded-full p-2 
                  ${
                    appointment.status === "upcoming"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : appointment.status === "completed"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-semibold">{appointment.title}</h3>
                      <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {appointment.doctor}
                        </span>
                        {appointment.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {appointment.time}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatDate(appointment.date)}
                      </p>
                      <p
                        className={`text-xs font-medium uppercase 
                        ${
                          appointment.status === "upcoming"
                            ? "text-blue-600 dark:text-blue-400"
                            : appointment.status === "completed"
                            ? "text-green-600 dark:text-green-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {appointment.status}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{appointment.location}</p>
                  {appointment.purpose && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Purpose: {appointment.purpose}
                    </p>
                  )}
                  {appointment.notes && (
                    <p className="mt-2 border-t border-dashed pt-2 text-sm text-muted-foreground">
                      {appointment.notes}
                    </p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {appointment.status === "upcoming" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Cancel
                      </Button>
                    )}
                    {appointment.status === "completed" && (
                      <Button size="sm" variant="outline">
                        Add Notes
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>About Your Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <p>
              Please arrive 15 minutes before your scheduled appointment time.
              Bring your ID, insurance card, and a list of current medications.
            </p>
            <p>
              If you need to cancel or reschedule, please do so at least 24
              hours in advance to avoid cancellation fees.
            </p>
            <p>
              For urgent matters, please call our office directly or use the
              Emergency feature in the app.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
