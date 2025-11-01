import { privateApi } from "./axiosIntance";

export const ResourceApiController = {
  uploadResource: async (template) => {
    return await privateApi.post(
      "/api/orders/template",
      template,
      { baseURL: "http://146.190.90.222:8083" } 
    );
  },
  getResourceByUserId: async (page,size) => {
    return await privateApi.get(
      `/api/orders/template/my-template?page=${page}&size=${size}`,
      { baseURL: "http://146.190.90.222:8083" } 
    );
  },
  acceptResource: async (resourceId) => {
    return await privateApi.post(
      `/api/orders/template/${resourceId}/confirm`,
      {},
      { baseURL: "http://146.190.90.222:8083" } 
    );
  },
  rejectResource: async (resourceId) => {
    return await privateApi.post(
      `/api/orders/template/${resourceId}/reject`,
      {},
      { baseURL: "http://146.190.90.222:8083" } 
    );
  },
  getResourceByStatus: async (status,page,size) => {
    return await privateApi.get(
      `/api/orders/template/review-status/${status}?page=${page}&size=${size}`,
      { baseURL: "http://146.190.90.222:8083" } 
    );
  },
};
