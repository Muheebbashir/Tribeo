import { axiosInstance } from "../lib/axios.js";

export const signup=async (signUpData) => {
    const response = await axiosInstance.post("/auth/register", signUpData);
    return response.data;
  }

  export const getAuthUser=async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    }

export const completeOnboarding=async (onboardingData) => {
  const response = await axiosInstance.post("/auth/onboarding", onboardingData);
  return response.data;
}