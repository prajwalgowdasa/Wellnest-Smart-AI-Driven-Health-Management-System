"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAppointment } from "@/lib/api";
import { Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function AddAppointmentDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    time: "",
    reason: "",
    location: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format the date and time properly
      const formattedDate = `${formData.date}T${formData.time || "09:00:00"}`;

      const appointmentData = {
        doctor: formData.doctor,
        date: formattedDate,
        reason: formData.reason,
        location: formData.location,
      };

      await createAppointment(appointmentData);
      toast.success("Appointment scheduled successfully");
      setOpen(false);
      router.refresh();
      // Reset form
      setFormData({
        doctor: "",
        date: "",
        time: "",
        reason: "",
        location: "",
      });
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      toast.error("Failed to schedule appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-9 w-9 rounded-full p-0">
          <Stethoscope className="h-4 w-4" />
          <span className="sr-only">Add Appointment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
            <DialogDescription>
              Enter the details for your upcoming appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doctor" className="text-right">
                Doctor
              </Label>
              <Input
                id="doctor"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Dr. Jane Smith"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="col-span-3"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <Input
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Annual checkup"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="col-span-3"
                placeholder="City Medical Center"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
