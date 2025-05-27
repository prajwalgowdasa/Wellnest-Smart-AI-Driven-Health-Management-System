import axios from "axios";

// Create a DRF API client for backend communication
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Create and export the API client
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    "Accept": "application/json",
  },
});

// Add request interceptor to handle multipart/form-data and binary data
apiClient.interceptors.request.use((config) => {
  // For binary data requests (like file downloads)
  if (config.responseType === 'arraybuffer') {
    config.headers["Accept"] = "*/*";
    // Remove Content-Type for binary requests
    delete config.headers["Content-Type"];
  } 
  // For FormData requests
  else if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } 
  // For regular JSON requests
  else {
    config.headers["Content-Type"] = "application/json";
  }

  // Log the request configuration for debugging
  console.log("API Request Config:", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    responseType: config.responseType,
    data: config.data instanceof FormData ? 'FormData' : 
         config.responseType === 'arraybuffer' ? 'Binary Data' : config.data
  });

  return config;
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    // Don't log binary responses
    if (response.config.responseType === 'arraybuffer') {
      console.log("API Response: Binary data received");
      return response;
    }

    // Log successful responses
    console.log("API Response:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  (error) => {
    // For binary response errors, create a more readable error
    if (error.config?.responseType === 'arraybuffer' && error.response?.data) {
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(error.response.data);
      try {
        error.response.data = JSON.parse(text);
      } catch {
        error.response.data = text;
      }
    }

    // Log detailed error information
    console.error("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        responseType: error.config?.responseType,
        data: error.config?.data instanceof FormData ? 'FormData' : 
             error.config?.responseType === 'arraybuffer' ? 'Binary Data' : error.config?.data
      }
    });
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
