import { axiosInstance } from "../lib/axios.js";

export const signup=async (signUpData) => {
    const response = await axiosInstance.post("/auth/register", signUpData);
    return response.data;
  }