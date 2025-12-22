import { orderApiController } from "../api/orderApiController";

export const orderService = {
  getTemplates: async (page = 0, size = 10) => {
    try {
      const res = await orderApiController.getTemplates(page, size);
      if (res?.data?.code === 200) {
        return res.data.result;
      }
      throw new Error(res?.data?.message || "Failed to fetch templates");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch templates";
      console.error("Get templates error:", err);
      throw new Error(message);
    }
  },

  getTemplateById: async (id) => {
    try {
      const res = await orderApiController.getTemplateById(id);
      if (res?.data?.code === 200) {
        return res.data.result;
      }
      throw new Error(res?.data?.message || "Failed to fetch template detail");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch template detail";
      console.error("Get template by id error:", err);
      throw new Error(message);
    }
  },
};
