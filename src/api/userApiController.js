import { privateApi } from "./axiosIntance";

export const userApiController = {
  getAllUser: async () => {
    return await privateApi.get(`/api/users`);
  },
  getUserById: async (id) => {
    return await privateApi.get(`/api/users/${id}`);
  },
};