// authService.js

import { jwtDecode } from "jwt-decode";
import { authApiController } from "../api/authApiController";

export const authService = {
  login: async (email, password) => {
    try {
      const res = await authApiController.login({ email, password });
      if (res?.data?.result) {
        const { accessToken, refreshToken } = res.data.result;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        const decoded = jwtDecode(accessToken);
        const roles = decoded?.realm_access?.roles || [];
        localStorage.setItem("roles", JSON.stringify(roles));

        return { accessToken, refreshToken, roles };
      }
      throw new Error("Login failed. Token not received.");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed.";
      console.log("Login error:", err.response?.data || err.message);
      throw new Error(message);
    }
  },

  register: async (userData) => {
    try {
      const res = await authApiController.register(userData);
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Register failed. Please try again.";
      throw new Error(message);
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const res = await authApiController.refreshToken(refreshToken);

      if (res?.data?.result?.accessToken) {
        localStorage.setItem("accessToken", res.data.result.accessToken);
        return res.data.result.accessToken;
      }

      return null;
    } catch (err) {
      console.log("Refresh token failed:", err.response?.data);
      return null;
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("roles");
      return true;
    } catch (e) {
      console.error("Error logging out:", e);
      return false;
    }
  },
  getProfile : async () => {
    try {
      const res = await authApiController.getProfile();
      return res.data.result;
    } catch (err) {
      const message =
        err.response?.data?.message || "Get profile failed. Please try again.";
      throw new Error(message);
    }
  },
};
