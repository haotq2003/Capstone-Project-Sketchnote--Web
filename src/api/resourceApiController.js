import { privateApi } from "./axiosIntance";

export const ResourceApiController = {
  uploadResource: async (template) => {
    return await privateApi.post("/api/orders/template", template);
  },

  getResourceByUserId: async (page, size) => {
    return await privateApi.get(
      `/api/orders/template/my-template?page=${page}&size=${size}`
    );
  },

  acceptResource: async (resourceId) => {
    return await privateApi.post(`/api/orders/template/${resourceId}/confirm`);
  },

  rejectResource: async (resourceId) => {
    return await privateApi.post(`/api/orders/template/${resourceId}/reject`);
  },

  getResourceByStatus: async (status, page, size) => {
    return await privateApi.get(
      `/api/orders/template/review-status/${status}?page=${page}&size=${size}`
    );
  },
};
