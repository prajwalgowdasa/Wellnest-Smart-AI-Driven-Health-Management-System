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
import { createVitalSign } from "@/lib/api";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function AddVitalDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    heart_rate: "",
    blood_pressure_systolic: "",
    blood_pressure_diastolic: "",
    temperature: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const data = {
        heart_rate: formData.heart_rate ? parseInt(formData.heart_rate) : null,
        blood_pressure_systolic: formData.blood_pressure_systolic
          ? parseInt(formData.blood_pressure_systolic)
          : null,
        blood_pressure_diastolic: formData.blood_pressure_diastolic
          ? parseInt(formData.blood_pressure_diastolic)
          : null,
        temperature: formData.temperature
          ? parseFloat(formData.temperature)
          : null,
      };

      await createVitalSign(data);
      toast.success("Vital signs recorded successfully");
      setOpen(false);
      router.refresh();
      // Reset form
      setFormData({
        heart_rate: "",
        blood_pressure_systolic: "",
        blood_pressure_diastolic: "",
        temperature: "",
      });
    } catch (error) {
      console.error("Error submitting vital signs:", error);
      toast.error("Failed to record vital signs");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-9 w-9 rounded-full p-0">
          <Heart className="h-4 w-4" />
          <span className="sr-only">Add Vitals</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Vital Signs</DialogTitle>
            <DialogDescription>
              Enter your current vital sign measurements.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="heart_rate" className="text-right">
                Heart Rate
              </Label>
              <Input
                id="heart_rate"
                name="heart_rate"
                type="number"
                placeholder="BPM"
                value={formData.heart_rate}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="blood_pressure_systolic" className="text-right">
                Systolic BP
              </Label>
              <Input
                id="blood_pressure_systolic"
                name="blood_pressure_systolic"
                type="number"
                placeholder="mmHg"
                value={formData.blood_pressure_systolic}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="blood_pressure_diastolic" className="text-right">
                Diastolic BP
              </Label>
              <Input
                id="blood_pressure_diastolic"
                name="blood_pressure_diastolic"
                type="number"
                placeholder="mmHg"
                value={formData.blood_pressure_diastolic}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="temperature" className="text-right">
                Temperature
              </Label>
              <Input
                id="temperature"
                name="temperature"
                type="number"
                step="0.1"
                placeholder="°C"
                value={formData.temperature}
                onChange={handleChange}
                className="col-span-3"
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
              {isSubmitting ? "Saving..." : "Save Vitals"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
