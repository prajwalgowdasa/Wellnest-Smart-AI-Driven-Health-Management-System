import axios from "axios";
import { apiClient } from "./db";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Health Records
export const getHealthRecords = async () => {
  const response = await apiClient.get("/health/records/");
  return response.data;
};

export const createHealthRecord = async (data: any) => {
  // Map frontend record types to Django choices
  const recordTypeMapping: Record<string, string> = {
    consultation: "consultation",
    labTest: "lab_test",
    lab_test: "lab_test",
    imaging: "imaging",
    medication: "medication",
    vaccination: "vaccination",
    other: "other",
  };

  // Validate the date is in YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data.date)) {
    throw new Error("Date must be in YYYY-MM-DD format");
  }

  // Format the date and time
  let formattedDate = data.date;
  if (data.time) {
    // If time is provided, combine it with the date
    formattedDate = `${data.date}T${data.time}`;
  }

  // Ensure data format matches DRF API expectations
  const formattedData = {
    title: data.title,
    record_type: recordTypeMapping[data.recordType] || "other", // Map to valid DRF choice
    doctor: data.doctor,
    date: formattedDate,
    description: data.description,
    // Add any additional fields needed by Django
  };

  console.log("Sending health record data to DRF:", formattedData);

  try {
    const response = await apiClient.post("/health/records/", formattedData);
    return response.data;
  } catch (error: any) {
    console.error("Health record creation error:", error);

    // Check for validation errors in the response
    if (error.response?.data) {
      // Extract validation errors from the DRF response
      const apiErrors = error.response.data;

      // Format DRF errors into a more frontend-friendly format
      const errorMessages: Record<string, string> = {};

      for (const field in apiErrors) {
        if (Array.isArray(apiErrors[field])) {
          errorMessages[field] = apiErrors[field][0];
        } else if (typeof apiErrors[field] === "string") {
          errorMessages[field] = apiErrors[field];
        }
      }

      // Create error object with formatted validation errors
      const validationError = new Error("Validation failed");
      (validationError as any).response = {
        data: { errors: errorMessages },
      };

      throw validationError;
    }

    throw error;
  }
};

export const getHealthRecord = async (id: string) => {
  const response = await apiClient.get(`/health/records/${id}/`);
  return response.data;
};

export const updateHealthRecord = async (id: string, data: any) => {
  const response = await apiClient.put(`/health/records/${id}/`, data);
  return response.data;
};

export const deleteHealthRecord = async (id: string) => {
  await apiClient.delete(`/health/records/${id}/`);
  return true;
};

// Vital Signs
export const getVitalSigns = async () => {
  try {
    const response = await apiClient.get("/health/vitals/");
    return response.data;
  } catch (error) {
    console.error("Error fetching vital signs:", error);
    return [];
  }
};

export const getLatestVitalSigns = async () => {
  try {
    const response = await apiClient.get("/health/vitals/latest/");
    return response.data;
  } catch (error) {
    console.error("Error fetching latest vital signs:", error);
    return null;
  }
};

export const createVitalSign = async (data: any) => {
  try {
    const response = await apiClient.post("/health/vitals/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating vital sign:", error);
    throw error;
  }
};

// Medications
export const getMedications = async () => {
  try {
    const response = await apiClient.get("/health/medications/");
    return response.data;
  } catch (error) {
    console.error("Error fetching medications:", error);
    return [];
  }
};

export const getActiveMedications = async () => {
  try {
    const response = await apiClient.get("/health/medications/active/");
    return response.data;
  } catch (error) {
    console.error("Error fetching active medications:", error);
    return [];
  }
};

// Appointments
export const getAppointments = async () => {
  try {
    // Use the Next.js API route instead of directly calling the Django API
    // This gives us better control over caching and ensures fresher data
    const response = await fetch("/api/health-appointments", {
      method: "GET",
      cache: "no-store", // Don't cache this request
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch appointments: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

export const getUpcomingAppointments = async () => {
  try {
    const response = await apiClient.get("/health/appointments/upcoming/");
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    return [];
  }
};

export const createAppointment = async (data: {
  doctor: string;
  date: string;
  purpose: string;
  location: string;
  notes?: string;
}) => {
  try {
    const response = await apiClient.post("/health/appointments/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// AI Insights
export const getAIInsights = async () => {
  try {
    // Return mock data directly if environment variable is set
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      console.log("Using mock data due to environment variable");
      // For a frontend component, we just need to return any valid data structure
      return {
        healthRisks: [
          {
            id: "1",
            category: "cardiovascular",
            name: "Cardiovascular Risk",
            level: "low",
            description:
              "Based on your blood pressure and cholesterol levels, your cardiovascular risk is low.",
            icon: "heart",
          },
          {
            id: "2",
            category: "metabolic",
            name: "Metabolic Risk",
            level: "moderate",
            description:
              "Your glucose levels indicate a moderate metabolic risk. Consider reducing sugar intake.",
            icon: "activity",
          },
        ],
        healthGoals: [
          {
            id: "1",
            name: "Increase daily steps",
            target: "8,000 steps daily",
            current: "5,460 steps daily",
            priority: 1,
          },
          {
            id: "2",
            name: "Reduce sodium intake",
            target: "<2,300mg daily",
            current: "~2,800mg daily",
            priority: 2,
          },
        ],
        recommendations: [
          {
            id: "1",
            category: "diet",
            title: "Diet Suggestions",
            content:
              "Consider increasing foods rich in iron and vitamin B12 such as lean meats, beans, and leafy greens.",
          },
          {
            id: "2",
            category: "exercise",
            title: "Exercise Recommendations",
            content:
              "Your cardiovascular fitness has improved. Consider adding 2 days of strength training to your routine.",
          },
        ],
        lastUpdated: new Date().toISOString(),
      };
    }

    // Use the Next.js API route instead of directly calling the Django API
    // This gives us better control over caching and ensures fresher data
    const response = await fetch("/api/ai-insights", {
      method: "GET",
      cache: "no-store", // Don't cache this request
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch AI insights: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    // Return mock data object as fallback to prevent UI errors
    return {
      healthRisks: [
        {
          id: "1",
          category: "cardiovascular",
          name: "Cardiovascular Risk",
          level: "low",
          description:
            "Based on your blood pressure and cholesterol levels, your cardiovascular risk is low.",
          icon: "heart",
        },
      ],
      healthGoals: [
        {
          id: "1",
          name: "Increase daily steps",
          target: "8,000 steps daily",
          current: "5,460 steps daily",
          priority: 1,
        },
      ],
      recommendations: [
        {
          id: "1",
          category: "diet",
          title: "Diet Suggestions",
          content: "Consider increasing foods rich in iron and vitamin B12.",
        },
      ],
      lastUpdated: new Date().toISOString(),
    };
  }
};

export const getRecentAIInsights = async () => {
  try {
    // For deployment, use mock data directly
    return [
      {
        id: "1",
        title: "Recent Blood Pressure Trend",
        content: "Your blood pressure has been stable for the last 2 weeks.",
        date: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Stress Management",
        content:
          "Your recent activity patterns suggest improved stress management.",
        date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      },
    ];
  } catch (error) {
    console.error("Error fetching recent AI insights:", error);
    // Return empty array as fallback
    return [];
  }
};

// Health Predictions
export const getHealthPredictions = async () => {
  try {
    // For deployment, use mock data directly
    return [
      {
        id: "1",
        category: "cardiovascular",
        title: "Heart Health",
        prediction: "Low risk of cardiovascular issues based on current data.",
        confidence: 0.85,
        date: new Date().toISOString(),
      },
      {
        id: "2",
        category: "metabolic",
        title: "Metabolic Health",
        prediction:
          "Moderate risk of metabolic issues. Consider dietary changes.",
        confidence: 0.72,
        date: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 week ago
      },
    ];
  } catch (error) {
    console.error("Error fetching health predictions:", error);
    return [];
  }
};

export const getLatestHealthPrediction = async () => {
  try {
    // For deployment, use mock data directly
    return {
      id: "1",
      category: "cardiovascular",
      title: "Heart Health",
      prediction: "Low risk of cardiovascular issues based on current data.",
      confidence: 0.85,
      date: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching latest health prediction:", error);
    return null;
  }
};

// Health Recommendations
export const getHealthRecommendations = async () => {
  try {
    // For deployment, use mock data directly
    return [
      {
        id: "1",
        category: "diet",
        title: "Dietary Suggestions",
        content: "Consider increasing your protein intake by 10-15%.",
        priority: "medium",
        date: new Date().toISOString(),
      },
      {
        id: "2",
        category: "exercise",
        title: "Exercise Plan",
        content:
          "Adding 2 days of strength training would improve your fitness profile.",
        priority: "high",
        date: new Date().toISOString(),
      },
      {
        id: "3",
        category: "sleep",
        title: "Sleep Optimization",
        content:
          "Your sleep pattern shows disruption between 2-4 AM. Consider limiting fluids before bed.",
        priority: "medium",
        date: new Date().toISOString(),
      },
    ];
  } catch (error) {
    console.error("Error fetching health recommendations:", error);
    return [];
  }
};

export const getHealthRecommendationsByCategory = async (category: string) => {
  try {
    // For deployment, use mock data filtered by category
    const allRecommendations = [
      {
        id: "1",
        category: "diet",
        title: "Dietary Suggestions",
        content: "Consider increasing your protein intake by 10-15%.",
        priority: "medium",
        date: new Date().toISOString(),
      },
      {
        id: "2",
        category: "exercise",
        title: "Exercise Plan",
        content:
          "Adding 2 days of strength training would improve your fitness profile.",
        priority: "high",
        date: new Date().toISOString(),
      },
      {
        id: "3",
        category: "sleep",
        title: "Sleep Optimization",
        content:
          "Your sleep pattern shows disruption between 2-4 AM. Consider limiting fluids before bed.",
        priority: "medium",
        date: new Date().toISOString(),
      },
    ];

    return allRecommendations.filter((rec) => rec.category === category);
  } catch (error) {
    console.error(
      `Error fetching health recommendations for category ${category}:`,
      error
    );
    return [];
  }
};

// User Profile API
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/users/profiles/me/");
    const data = response.data;

    // Convert snake_case to camelCase for frontend
    return {
      id: data.id,
      first_name: data.name || `${data.first_name} ${data.last_name}`,
      email: data.email,
      phone_number: data.phone_number,
      date_of_birth: data.date_of_birth
        ? new Date(data.date_of_birth)
        : undefined,
      gender: data.gender,
      blood_type: data.blood_type,
      height_cm: data.height_cm,
      weight_kg: data.weight_kg,
      bmi:
        data.bmi ||
        (data.height_cm && data.weight_kg
          ? Math.round(
              (data.weight_kg / Math.pow(data.height_cm / 100, 2)) * 10
            ) / 10
          : null),
      displayFormat: data.display_format || {
        temperature: "celsius",
        height: "cm",
        weight: "kg",
      },
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // Fall back to mock data
    return {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1985-05-15",
      gender: "male",
      bloodType: "O+",
      height: 178,
      weight: 75,
      bmi: 23.7,
      displayFormat: {
        temperature: "celsius",
        height: "cm",
        weight: "kg",
      },
    };
  }
};

export const updateUserProfile = async (data: any) => {
  try {
    // Create a normalized copy for the API
    const apiData: any = { ...data };

    // Map camelCase field names to snake_case for API
    const fieldMappings: Record<string, string> = {
      name: "name",
      email: "email",
      phone: "phone_number",
      dateOfBirth: "date_of_birth",
      gender: "gender",
      bloodType: "blood_type",
      height: "height_cm",
      weight: "weight_kg",
    };

    // Create a properly formatted object for the API
    const mappedData: Record<string, any> = {};

    Object.entries(apiData).forEach(([key, value]) => {
      if (fieldMappings[key]) {
        mappedData[fieldMappings[key]] = value;
      } else {
        mappedData[key] = value;
      }
    });

    const response = await apiClient.put(
      "/users/profiles/update_me/",
      mappedData
    );

    // Convert response data back to camelCase for frontend
    const profileData = response.data;
    return {
      id: profileData.id,
      name:
        profileData.name ||
        `${profileData.first_name} ${profileData.last_name}`,
      email: profileData.email,
      phone: profileData.phone_number,
      dateOfBirth: profileData.date_of_birth
        ? new Date(profileData.date_of_birth)
        : undefined,
      gender: profileData.gender,
      bloodType: profileData.blood_type,
      height: profileData.height_cm,
      weight: profileData.weight_kg,
      bmi: profileData.bmi,
      displayFormat: profileData.display_format || {
        temperature: "celsius",
        height: "cm",
        weight: "kg",
      },
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Emergency Contacts
export const getEmergencyContacts = async () => {
  try {
    const response = await apiClient.get("/users/emergency-contacts/");
    return response.data;
  } catch (error) {
    console.error("Error fetching emergency contacts:", error);
    // Return mock data
    return [
      {
        id: "1",
        name: "Sarah Smith",
        relationship: "spouse",
        phoneNumber: "+1 (555) 987-6543",
        email: "sarah.smith@example.com",
      },
      {
        id: "2",
        name: "Michael Johnson",
        relationship: "brother",
        phoneNumber: "+1 (555) 456-7890",
        email: "michael.johnson@example.com",
      },
    ];
  }
};

export const createEmergencyContact = async (contactData: any) => {
  try {
    // Normalize field names for API
    const apiData = { ...contactData };

    // Convert phoneNumber to phone_number if needed
    if (apiData.phoneNumber && !apiData.phone_number) {
      apiData.phone_number = apiData.phoneNumber;
      delete apiData.phoneNumber;
    }

    const response = await apiClient.post(
      "/users/emergency-contacts/",
      apiData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating emergency contact:", error);
    throw error;
  }
};

export const updateEmergencyContact = async (id: string, contactData: any) => {
  try {
    // Normalize field names for API
    const apiData = { ...contactData };

    // Convert phoneNumber to phone_number if needed
    if (apiData.phoneNumber && !apiData.phone_number) {
      apiData.phone_number = apiData.phoneNumber;
      delete apiData.phoneNumber;
    }

    const response = await apiClient.put(
      `/users/emergency-contacts/${id}/`,
      apiData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating emergency contact:", error);
    throw error;
  }
};

export const deleteEmergencyContact = async (contactId: string) => {
  try {
    await apiClient.delete(`/users/emergency-contacts/${contactId}/`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting emergency contact:", error);
    throw error;
  }
};

// Doctor Availability
export const getDoctorAvailability = async (
  doctorId?: string,
  date?: string
) => {
  try {
    let url = "/doctors/availability/";
    if (doctorId && date) {
      url += `?doctor_id=${doctorId}&date=${date}`;
    } else if (doctorId) {
      url += `?doctor_id=${doctorId}`;
    } else if (date) {
      url += `?date=${date}`;
    }

    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor availability:", error);
    // Return default time slots as fallback
    return [
      { id: "1", start_time: "09:00", end_time: "09:30", available: true },
      { id: "2", start_time: "09:30", end_time: "10:00", available: true },
      { id: "3", start_time: "10:00", end_time: "10:30", available: false },
      { id: "4", start_time: "10:30", end_time: "11:00", available: true },
      { id: "5", start_time: "11:00", end_time: "11:30", available: true },
      { id: "6", start_time: "11:30", end_time: "12:00", available: false },
      { id: "7", start_time: "13:00", end_time: "13:30", available: true },
      { id: "8", start_time: "13:30", end_time: "14:00", available: true },
      { id: "9", start_time: "14:00", end_time: "14:30", available: true },
      { id: "10", start_time: "14:30", end_time: "15:00", available: false },
      { id: "11", start_time: "15:00", end_time: "15:30", available: true },
      { id: "12", start_time: "15:30", end_time: "16:00", available: true },
    ];
  }
};

// Function to trigger AI insights update/generation
export const triggerAIInsightsUpdate = async () => {
  try {
    const response = await fetch("/api/ai-insights/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update AI insights: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error triggering AI insights update:", error);
    throw error;
  }
};

// Export only the apiClient for external use
export default apiClient;
