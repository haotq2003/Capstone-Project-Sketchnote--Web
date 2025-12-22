import { privateApi, publicApi } from "./axiosIntance";

export const authApiController = {
  login: async (credentials) => {
    return await publicApi.post(`/api/auth/login`, credentials);
  },

  register: async (userData) => {
    return await publicApi.post(`/api/auth/register`, userData, {
      baseURL: "http://146.190.90.222:8089",
    });
  },

  refreshToken: async (refreshToken) => {
    return await publicApi.post(`/api/auth/refresh-token`, { refreshToken });
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      // Gọi API logout nếu cần
      // await publicApi.post(`/api/auth/logout`, { refreshToken });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("roles");
      localStorage.removeItem("userInfo");
      return true;
    } catch (e) {
      console.error("Error logging out:", e);
      return false;
    }
  },

  getProfile: async () => {
    return await privateApi.get(`/api/users/me/profile`);
  },
};
