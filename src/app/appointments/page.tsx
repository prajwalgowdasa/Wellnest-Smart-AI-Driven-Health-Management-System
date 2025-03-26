"use client";

import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Plus, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Appointment {
  id: string;
  title: string;
  doctor: string;
  date: Date;
  time: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  notes?: string;
}

export default function AppointmentsPage() {
  // Sample appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      title: "Annual Checkup",
      doctor: "Dr. Sarah Johnson",
      date: new Date(2024, 5, 15), // June 15, 2024
      time: "10:00 AM",
      location: "City Health Clinic, Room 204",
      status: "upcoming",
    },
    {
      id: "2",
      title: "Dental Cleaning",
      doctor: "Dr. Michael Wong",
      date: new Date(2024, 5, 28), // June 28, 2024
      time: "2:30 PM",
      location: "Smile Dental Care, 3rd Floor",
      status: "upcoming",
    },
    {
      id: "3",
      title: "Cardiology Follow-up",
      doctor: "Dr. Lisa Anderson",
      date: new Date(2024, 4, 10), // May 10, 2024
      time: "9:15 AM",
      location: "Heart Health Center",
      status: "completed",
      notes: "Blood pressure normal, continue current medication",
    },
  ]);

  const [filter, setFilter] = useState<
    "all" | "upcoming" | "completed" | "cancelled"
  >("all");

  // Filter appointments based on status
  const filteredAppointments = appointments.filter(
    (appointment) => filter === "all" || appointment.status === filter
  );

  // Function to cancel an appointment
  const handleCancelAppointment = (id: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: "cancelled" as const } : apt
      )
    );
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

      {filteredAppointments.length === 0 ? (
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
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {appointment.time}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {appointment.date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
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
