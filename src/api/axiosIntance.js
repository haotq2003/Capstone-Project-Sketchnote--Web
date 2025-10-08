
import axios from "axios";
import { authService } from "../service/authService";


const API_URL = import.meta.env.VITE_API_URL;

export const publicApi = axios.create({
    baseURL:API_URL,
})

export const privateApi  = axios.create({
    baseURL:API_URL,
})

privateApi.interceptors.request.use(async (config) => {
  const token = await localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
privateApi.interceptors.response.use(
    (response) => response,
    async (error) =>{
        const originalRequest = error.config;
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            const newToken = await authService.refreshToken();
          if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return privateApi(originalRequest);
      }
            
        }
        return Promise.reject(error)
    }
)