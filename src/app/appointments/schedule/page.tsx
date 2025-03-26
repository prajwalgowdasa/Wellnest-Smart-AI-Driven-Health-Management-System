"use client";

import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const doctorOptions = [
  { id: "1", name: "Dr. Sarah Johnson", specialty: "General Practitioner" },
  { id: "2", name: "Dr. Michael Wong", specialty: "Dentist" },
  { id: "3", name: "Dr. Lisa Anderson", specialty: "Cardiologist" },
  { id: "4", name: "Dr. Robert Smith", specialty: "Dermatologist" },
  { id: "5", name: "Dr. Emily Davis", specialty: "Neurologist" },
];

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
];

export default function ScheduleAppointmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    doctorId: "",
    date: "",
    timeSlot: "",
    reason: "",
  });

  // Create a min date string for the date input (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Create a max date string for the date input (6 months from now)
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  const maxDate = sixMonthsFromNow.toISOString().split("T")[0];

  // Handle form data change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Go to next step
  const handleNextStep = () => {
    setStep(step + 1);
  };

  // Go to previous step
  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real application, you'd make an API call here to save the appointment
      console.log("Appointment data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to appointments page
      router.push("/appointments");
    } catch (error) {
      console.error("Error scheduling appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if the current step is valid and can proceed
  const canProceed = () => {
    if (step === 1) {
      return formData.doctorId !== "" && formData.title !== "";
    } else if (step === 2) {
      return formData.date !== "" && formData.timeSlot !== "";
    }
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/appointments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Schedule Appointment</h1>
      </div>

      <div className="mx-auto max-w-2xl">
        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  step >= 1
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                1
              </div>
              <span className="mt-1 text-xs">Doctor</span>
            </div>
            <div
              className={`h-1 flex-1 ${step >= 2 ? "bg-primary" : "bg-muted"}`}
            ></div>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  step >= 2
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                2
              </div>
              <span className="mt-1 text-xs">Date & Time</span>
            </div>
            <div
              className={`h-1 flex-1 ${step >= 3 ? "bg-primary" : "bg-muted"}`}
            ></div>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  step >= 3
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                3
              </div>
              <span className="mt-1 text-xs">Confirm</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Select a Doctor"}
              {step === 2 && "Choose Date and Time"}
              {step === 3 && "Confirm Appointment"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Select Doctor */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Appointment Title
                    </label>
                    <input
                      id="title"
                      name="title"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="e.g., Annual Checkup"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="doctorId" className="text-sm font-medium">
                      Select Doctor
                    </label>
                    <select
                      id="doctorId"
                      name="doctorId"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.doctorId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a Doctor</option>
                      {doctorOptions.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Select Date and Time */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="date" className="text-sm font-medium">
                      Appointment Date
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      min={minDate}
                      max={maxDate}
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="timeSlot" className="text-sm font-medium">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <label
                          key={time}
                          className={`flex cursor-pointer items-center justify-center rounded-md border p-2 text-sm transition-colors ${
                            formData.timeSlot === time
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-input hover:bg-accent"
                          }`}
                        >
                          <input
                            type="radio"
                            name="timeSlot"
                            value={time}
                            checked={formData.timeSlot === time}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          {time}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm Details */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="reason" className="text-sm font-medium">
                      Reason for Visit
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Please briefly describe the reason for your appointment..."
                      value={formData.reason}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="rounded-md bg-muted p-4">
                    <h3 className="mb-2 font-medium">Appointment Summary</h3>
                    <dl className="grid gap-2 text-sm">
                      <div className="grid grid-cols-3">
                        <dt className="font-medium text-muted-foreground">
                          Title:
                        </dt>
                        <dd className="col-span-2">{formData.title}</dd>
                      </div>
                      <div className="grid grid-cols-3">
                        <dt className="font-medium text-muted-foreground">
                          Doctor:
                        </dt>
                        <dd className="col-span-2">
                          {doctorOptions.find((d) => d.id === formData.doctorId)
                            ?.name || ""}
                        </dd>
                      </div>
                      <div className="grid grid-cols-3">
                        <dt className="font-medium text-muted-foreground">
                          Date:
                        </dt>
                        <dd className="col-span-2">
                          {formData.date
                            ? new Date(formData.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : ""}
                        </dd>
                      </div>
                      <div className="grid grid-cols-3">
                        <dt className="font-medium text-muted-foreground">
                          Time:
                        </dt>
                        <dd className="col-span-2">{formData.timeSlot}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </Button>
                ) : (
                  <Link href="/appointments">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                )}

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!canProceed()}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Scheduling..." : "Confirm Appointment"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
