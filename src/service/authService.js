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

        // Lưu thông tin user
        const userInfo = {
          id: decoded?.sub,
          email: decoded?.email || decoded?.preferred_username,
          firstName: decoded?.given_name,
          lastName: decoded?.family_name,
          name: decoded?.name,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

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

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.log("No refresh token found");
        return null;
      }

      const res = await authApiController.refreshToken(refreshToken);

      if (res?.data?.code === 200 && res?.data?.result?.accessToken) {
        const { accessToken, refreshToken: newRefreshToken } = res.data.result;

        localStorage.setItem("accessToken", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Cập nhật roles từ token mới
        const decoded = jwtDecode(accessToken);
        const roles = decoded?.realm_access?.roles || [];
        localStorage.setItem("roles", JSON.stringify(roles));

        return accessToken;
      }

      return null;
    } catch (err) {
      console.log("Refresh token failed:", err.response?.data || err.message);
      return null;
    }
  },

  logout: async () => {
    try {
      await authApiController.logout();
      return true;
    } catch (e) {
      console.error("Error logging out:", e);
      return false;
    }
  },

  getProfile: async () => {
    try {
      const res = await authApiController.getProfile();
      return res.data.result;
    } catch (err) {
      const message =
        err.response?.data?.message || "Get profile failed. Please try again.";
      throw new Error(message);
    }
  },

  // Kiểm tra token còn hạn không
  isTokenExpired: (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  },

  // Lấy thông tin user từ localStorage
  getCurrentUser: () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      return userInfo ? JSON.parse(userInfo) : null;
    } catch {
      return null;
    }
  },

  // Lấy roles từ localStorage
  getRoles: () => {
    try {
      const roles = localStorage.getItem("roles");
      return roles ? JSON.parse(roles) : [];
    } catch {
      return [];
    }
  },
};
