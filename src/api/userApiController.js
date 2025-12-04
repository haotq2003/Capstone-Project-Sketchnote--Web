import { privateApi } from "./axiosIntance";

export const userApiController = {
  getAllUser: async (pageNo, pageSize) => {
    return await privateApi.get(`/api/users?pageNo=${pageNo}&pageSize=${pageSize}`);
},

  getUserById: async (id) => {
    return await privateApi.get(`/api/users/${id}`);
  },
  getRole: async() =>{
    return await privateApi.get(`/api/roles`);
  },
  updateUserRole: async ( role) => {
    return await privateApi.post(`/api/roles`, role);
  },
  deleteUser: async (id) => {
    return await privateApi.delete(`/api/users/${id}`);
  }
};