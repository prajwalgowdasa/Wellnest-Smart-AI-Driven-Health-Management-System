import { NextResponse } from "next/server";

// Mock database of emergency contacts
export let contacts = [
  {
    id: 1,
    name: "Sarah Smith",
    relationship: "spouse",
    phone_number: "+1 (555) 987-6543",
    email: "sarah.smith@example.com",
  },
  {
    id: 2,
    name: "Michael Johnson",
    relationship: "brother",
    phone_number: "+1 (555) 456-7890",
    email: "michael.johnson@example.com",
  },
];

export async function GET() {
  return NextResponse.json(contacts);
}

export async function POST(request: Request) {
  const contact = await request.json();

  // Generate a new ID (in a real app, the database would handle this)
  const newId =
    contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 1;

  const newContact = {
    id: newId,
    ...contact,
  };

  contacts.push(newContact);

  return NextResponse.json(newContact, { status: 201 });
}
