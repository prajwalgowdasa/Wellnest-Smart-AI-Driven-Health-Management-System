import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Fetch the health record by ID
    const record = await prisma.healthRecord.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("Failed to fetch health record:", error);
    return NextResponse.json(
      { error: "Failed to fetch health record" },
      { status: 500 }
    );
  }
}

// Allow updating a record
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    // Get the existing record first to make sure it exists
    const existingRecord = await prisma.healthRecord.findUnique({
      where: {
        id,
      },
    });

    if (!existingRecord) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    // Update the record
    const updatedRecord = await prisma.healthRecord.update({
      where: {
        id,
      },
      data: {
        title: body.title ?? existingRecord.title,
        recordType: body.recordType ?? existingRecord.recordType,
        doctor: body.doctor ?? existingRecord.doctor,
        date: body.date ? new Date(body.date) : existingRecord.date,
        description: body.description ?? existingRecord.description,
      },
    });

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error("Failed to update health record:", error);
    return NextResponse.json(
      { error: "Failed to update health record" },
      { status: 500 }
    );
  }
}

// Allow deleting a record
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Get the existing record first to make sure it exists
    const existingRecord = await prisma.healthRecord.findUnique({
      where: {
        id,
      },
    });

    if (!existingRecord) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    // Delete the record
    await prisma.healthRecord.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete health record:", error);
    return NextResponse.json(
      { error: "Failed to delete health record" },
      { status: 500 }
    );
  }
}
