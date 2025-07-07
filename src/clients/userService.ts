// clients/userService.ts

import { ApiBackend } from "./axios";
import { UpdateProfileDto } from "@/interfaces/User";

export const getProfile = async (token: string) => {
  const response = await ApiBackend.get("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

export const updateProfile = async (token: string, data: UpdateProfileDto) => {
  const response = await ApiBackend.patch("/user/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
