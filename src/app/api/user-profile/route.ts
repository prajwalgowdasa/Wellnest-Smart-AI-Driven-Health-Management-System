import { NextResponse } from "next/server";

// Mock user profile
let userProfile = {
  id: 1,
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  phone_number: "+1 (555) 123-4567",
  date_of_birth: "1985-05-15",
  gender: "male",
  blood_type: "O+",
  height_cm: 178,
  weight_kg: 75,
  bmi: 23.7,
  display_format_preferences: {
    temperature: "celsius",
    weight: "kg",
    height: "cm",
    date: "MM/DD/YYYY",
    time: "12h",
  },
};

export async function GET() {
  return NextResponse.json(userProfile);
}

export async function PUT(request: Request) {
  const updates = await request.json();

  // Update the profile with the new data
  userProfile = {
    ...userProfile,
    ...updates,
    // Recalculate BMI if height or weight changes
    ...(updates.height_cm &&
      updates.weight_kg && {
        bmi: parseFloat(
          (updates.weight_kg / Math.pow(updates.height_cm / 100, 2)).toFixed(1)
        ),
      }),
    // Update only the display format preferences that were provided
    display_format_preferences: {
      ...userProfile.display_format_preferences,
      ...(updates.display_format_preferences || {}),
    },
  };

  return NextResponse.json(userProfile);
}
