import apiClient from "../../config/axios-config";

const logoutUser = async (): Promise<void> => {
  try {
    // Make an API call to the logout endpoint
    await apiClient.post("/auth/logout"); // Adjust the endpoint as per your backend
  } catch (error) {
    console.error("Logout failed:", error);
    // Continue with local cleanup even if API call fails
  } finally {
    // Clear ALL relevant items from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isFirstLogin");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Clear session storage
    sessionStorage.clear();
    
    // Use window.location for a full page refresh to clear any remaining state
    window.location.href = "/signin";
  }
};

export default logoutUser;
