"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContacts,
  updateEmergencyContact,
} from "@/lib/api";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  phone_number?: string; // Optional for compatibility
  email: string;
}

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<EmergencyContact>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const data = await getEmergencyContacts();
      setContacts(data);
    } catch (error) {
      console.error("Failed to fetch emergency contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAddContact = () => {
    setIsEditing(false);
    setFormData({});
    setDialogOpen(true);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setIsEditing(true);
    setFormData(contact);
    setDialogOpen(true);
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      setIsLoading(true);
      try {
        await deleteEmergencyContact(id);
        setContacts(contacts.filter((contact) => contact.id !== id));
      } catch (error) {
        console.error("Failed to delete contact:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveContact = async () => {
    if (!formData.name || !formData.phoneNumber) return;

    setIsLoading(true);
    try {
      if (isEditing && formData.id) {
        const updatedContact = await updateEmergencyContact(
          formData.id,
          formData as Omit<EmergencyContact, "id">
        );
        setContacts(
          contacts.map((contact) =>
            contact.id === updatedContact.id ? updatedContact : contact
          )
        );
      } else {
        const newContact = await createEmergencyContact(
          formData as Omit<EmergencyContact, "id">
        );
        setContacts([...contacts, newContact]);
      }
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to save contact:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Emergency Contacts</CardTitle>
        <Button onClick={handleAddContact} size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Contact
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && contacts.length === 0 ? (
          <div className="text-center py-8">Loading contacts...</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No emergency contacts added yet
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 border rounded-md"
              >
                <div>
                  <h3 className="font-medium">{contact.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {contact.relationship}
                  </p>
                  <p className="text-sm">{contact.phoneNumber}</p>
                  <p className="text-sm">{contact.email}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditContact(contact)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Emergency Contact" : "Add Emergency Contact"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Select
                  value={formData.relationship || ""}
                  onValueChange={(value) =>
                    handleSelectChange("relationship", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveContact} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Contact"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
