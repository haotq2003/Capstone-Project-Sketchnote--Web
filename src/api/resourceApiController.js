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

  getResourceByStatus: async (status, page, size, sortBy, sortDir) => {
    return await privateApi.get(
      `/api/orders/template/review-status/${status}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  },
  getResourceVersion: async(page, size) => {
    return await privateApi.get(
      `/api/orders/template/review/versions?page=${page}&size=${size}`
    );
  },
  ReviewResourceVersion: async (resourceId,data) => {
    return await privateApi.post(`/api/orders/template/versions/${resourceId}/review`,data);
  },
};
