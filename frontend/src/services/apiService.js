import axios from "axios";

// // Base URL for the backend API
// const API_URL = "https://code-review-assistant-backend.vercel.app/api";

// // Authentication credentials
// const username = "admin";
// const password = "V!pUl_2024$Str0ngP@ssw0rd!";

const API_URL = import.meta.env.VITE_API_URL;
const username = import.meta.env.VITE_AUTH_USERNAME;
const password = import.meta.env.VITE_AUTH_PASSWORD;

// On the server-side or Node.js side (not on client-side)
// const API_URL = process.env.VITE_API_URL;
// const username = process.env.VITE_AUTH_USERNAME;
// const password = process.env.VITE_AUTH_PASSWORD;

// Create an axios instance with authentication
const apiClient = axios.create({
  baseURL: API_URL, // Base URL without the specific endpoint
  auth: {
    username,
    password,
  },
});

const apiService = {
  reviewCode: async (code, language) => {
    try {
      console.log();
      // Make the POST request to the `/review` endpoint
      const response = await apiClient.post(`/review`, {
        code,
        language,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        // Handle server-side errors
        if (error.response.status === 401) {
          console.log(error);
          throw new Error(
            "Authentication failed. Please check your credentials.",
            error
          );
        }
        throw new Error(error.response.data.error || "Server error");
      } else if (error.request) {
        // Handle no response from server
        throw new Error("No response from server");
      } else {
        // Handle other errors during setup
        throw new Error("Error setting up request");
      }
    }
  },
};

export default apiService;
