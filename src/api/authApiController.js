import { publicApi } from "./axiosIntance";







export const authApiController = {
login: async (credentials) => {
    
      return await publicApi.post(`/api/auth/login`, credentials); 
    
  },
register: async (userData) => {
   
        return await publicApi.post(`/api/auth/register`, userData);
   
  },
refeshToken : async (refreshToken) => {

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
}
