"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";

export default function HelpPage() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending a support request
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage("");
      toast({
        title: "Support request sent",
        description: "We've received your message and will respond shortly.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Help & Support</h3>
        <p className="text-sm text-muted-foreground">
          Get help with using the application
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>FAQ</CardTitle>
            <CardDescription>
              Frequently asked questions about the app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  How do I update my health records?
                </AccordionTrigger>
                <AccordionContent>
                  You can update your health records by navigating to the
                  Records section and clicking on "Add New Record". Fill in the
                  form with your latest health information and save it.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Can I share my health information with my doctor?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, you can share your health information with your
                  healthcare providers. Go to the Share section, select the data
                  you want to share, enter your doctor's email, and send an
                  invitation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  How secure is my health data?
                </AccordionTrigger>
                <AccordionContent>
                  We take data security very seriously. All your health data is
                  encrypted both in transit and at rest. We use
                  industry-standard security protocols and regular security
                  audits to ensure your information remains private.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>
                  How do I set up medication reminders?
                </AccordionTrigger>
                <AccordionContent>
                  To set up medication reminders, go to the Medications section,
                  select the medication you want to be reminded about, and click
                  "Set Reminder". You can customize the frequency and timing of
                  your reminders.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>
                  Can I export my health data?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, you can export your health data. Go to Settings, select
                  "Privacy & Security", and then click on "Export My Data". You
                  can choose to export in PDF or CSV format.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Get help from our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Your Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue or question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Alternative ways to reach our support team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Phone Support</div>
                <div className="text-sm text-muted-foreground">
                  +1 (800) 123-4567
                </div>
                <div className="text-xs text-muted-foreground">
                  Mon-Fri, 9am-5pm EST
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Email Support</div>
                <div className="text-sm text-muted-foreground">
                  support@healthapp.com
                </div>
                <div className="text-xs text-muted-foreground">
                  24/7 response within 24 hours
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Live Chat</div>
                <div className="text-sm text-muted-foreground">
                  Available in the app
                </div>
                <div className="text-xs text-muted-foreground">
                  Mon-Fri, 9am-8pm EST
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
