import { privateApi, publicApi } from "./axiosIntance";







export const authApiController = {
login: async (credentials) => {
    
      return await publicApi.post(`/api/auth/login`, credentials); 
    
  },
register: async (userData) => {
   
        return await publicApi.post(`/api/auth/register`, userData,{
        baseURL: 'http://146.190.90.222:8089',
      });
   
  },
refreshToken: async (refreshToken) => {

       return await publicApi.post(`/api/auth/refresh-token`, { refreshToken });
 
},
logout: async () => {
    try {
      await localStorage.removeItem("accessToken");
      return true;
    } catch (e) {
      console.error("Error logging out:", e);
      return false;
    }
  },
  getProfile : async () => {
    return await privateApi.get(`/api/users/me/profile`);
  }
}
