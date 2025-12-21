import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const publicApi = axios.create({
  baseURL: API_URL,
});

export const privateApi = axios.create({
  baseURL: API_URL,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const attachAuthInterceptor = (instance) => {
  // 🪪 Attach token before each request
  instance.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 🔄 Auto refresh token on 401
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Only attempt refresh for 401 errors and if not already retried
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Check if refresh token exists before attempting refresh
        const refreshToken = localStorage.getItem("refreshToken");

        // If no refresh token, clear all auth data and reject immediately
        if (!refreshToken) {
          console.warn("No refresh token found, clearing auth state");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          localStorage.removeItem("roles");
          // Redirect to login
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await axios.post(`${API_URL}api/auth/refresh-token`, {
            refreshToken,
          });

          const newToken = res?.data?.result?.accessToken;
          const newRefreshToken = res?.data?.result?.refreshToken;

          if (newToken) {
            // Save new tokens
            localStorage.setItem("accessToken", newToken);
            localStorage.setItem("token", newToken); // For backward compatibility
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }

            // Update request header
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // Process queued requests
            processQueue(null, newToken);
            isRefreshing = false;

            // Retry original request
            return instance(originalRequest);
          } else {
            throw new Error("No access token in refresh response");
          }
        } catch (refreshError) {
          // Log as warning (not error) since expired tokens are expected
          console.warn("Refresh token expired or invalid - user needs to log in again");

          // Clear all auth data on refresh failure
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          localStorage.removeItem("roles");

          // Process queued requests with error
          processQueue(refreshError, null);
          isRefreshing = false;

          // Redirect to login
          window.location.href = "/login";

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

attachAuthInterceptor(privateApi);