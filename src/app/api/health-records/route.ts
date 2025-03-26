import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Temporary user ID for demo purposes (in a real app, this would come from auth)
const DEMO_USER_ID = "user-1";

export async function GET() {
  try {
    // Check if demo user exists, create if not
    const user = await getOrCreateDemoUser();

    // Get all health records for the demo user
    const records = await prisma.healthRecord.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("Failed to fetch health records:", error);
    return NextResponse.json(
      { error: "Failed to fetch health records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if demo user exists, create if not
    const user = await getOrCreateDemoUser();

    // Create a new health record
    const record = await prisma.healthRecord.create({
      data: {
        title: body.title,
        recordType: body.recordType,
        doctor: body.doctor,
        date: new Date(body.date),
        description: body.description,
        userId: user.id,
      },
    });

    // In a real app, you would handle file uploads here

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Failed to create health record:", error);
    return NextResponse.json(
      { error: "Failed to create health record" },
      { status: 500 }
    );
  }
}

// Helper function to get or create the demo user
async function getOrCreateDemoUser() {
  const existingUser = await prisma.user.findFirst({
    where: {
      id: DEMO_USER_ID,
    },
  });

  if (existingUser) {
    return existingUser;
  }

  // Create a demo user
  return prisma.user.create({
    data: {
      id: DEMO_USER_ID,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: new Date("1985-06-15"),
      gender: "Male",
      bloodType: "O+",
      height: 178, // cm
      weight: 75, // kg
    },
  });
}
