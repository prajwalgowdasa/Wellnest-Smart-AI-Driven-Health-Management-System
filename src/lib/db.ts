import axios from "axios";

// Create a DRF API client for backend communication
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Create and export the API client
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add withCredentials for CORS with credentials if needed
  // withCredentials: true,
});

// Add response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a DRF-specific error format
    const errorResponse = error.response;

    if (errorResponse) {
      // Log detailed error information to help debugging
      console.error("API Error:", {
        status: errorResponse.status,
        statusText: errorResponse.statusText,
        data: errorResponse.data,
        url: errorResponse.config.url,
        method: errorResponse.config.method,
      });

      // Enhance error message with DRF error details if available
      if (errorResponse.data) {
        // Handle both string and object error formats from DRF
        if (typeof errorResponse.data === "string") {
          error.message = errorResponse.data;
        } else if (typeof errorResponse.data === "object") {
          // DRF often returns errors as an object with field names as keys
          // or as a non-field-errors array
          const errorMessages = [];

          if (errorResponse.data.non_field_errors) {
            errorMessages.push(...errorResponse.data.non_field_errors);
          }

          // Collect all field-specific errors
          Object.entries(errorResponse.data).forEach(([field, errors]) => {
            if (field !== "non_field_errors") {
              if (Array.isArray(errors)) {
                errorMessages.push(`${field}: ${errors.join(", ")}`);
              } else {
                errorMessages.push(`${field}: ${errors}`);
              }
            }
          });

          if (errorMessages.length > 0) {
            error.message = errorMessages.join("; ");
          }
        }
      }
    } else {
      // Network error or other non-response error
      console.error("API Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Helper function to handle authentication tokens if needed
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};
