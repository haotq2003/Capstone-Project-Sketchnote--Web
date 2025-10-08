import { privateApi } from "./axiosIntance";

export const userApiController = {
  getAllUser: async () => {
    return await privateApi.get(`/api/users`,{
       baseURL: 'http://146.190.90.222:8089',
    });
  },
};