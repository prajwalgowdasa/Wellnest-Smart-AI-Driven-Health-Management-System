import { NextResponse } from "next/server";

// Reference to our mock database from the parent route
// In a real app, you would use a proper database connection
import { contacts } from "../route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const contact = contacts.find((c) => c.id === id);

  if (!contact) {
    return NextResponse.json(
      { error: "Emergency contact not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(contact);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const updatedContact = await request.json();
  const index = contacts.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Emergency contact not found" },
      { status: 404 }
    );
  }

  contacts[index] = { ...contacts[index], ...updatedContact, id };

  return NextResponse.json(contacts[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const index = contacts.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Emergency contact not found" },
      { status: 404 }
    );
  }

  const deletedContact = contacts[index];
  contacts.splice(index, 1);

  return NextResponse.json(deletedContact);
}
