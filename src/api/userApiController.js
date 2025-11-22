import { privateApi } from "./axiosIntance";

export const userApiController = {
  getAllUser: async () => {
    return await privateApi.get(`/api/users`);
  },
  getUserById: async () => {
    return await privateApi.get(`/api/users/me`);
  },
};