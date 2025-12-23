import { publicApi } from "./axiosIntance";

export const orderApiController = {
  getTemplates: async (page = 0, size = 10) => {
    return await publicApi.get(`/api/orders/template`, {
      params: { page, size },
    });
  },

  getTemplateById: async (id) => {
    return await publicApi.get(`/api/orders/template/${id}`);
  },
};
