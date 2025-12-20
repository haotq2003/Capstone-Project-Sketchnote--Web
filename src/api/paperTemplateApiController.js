import { privateApi } from "./axiosIntance";

export const PaperTemplateApiController = {
  // Get all category papers with pagination and filtering
  getCategoryPapers: async (paperType, keyword, page, size) => {
    const params = new URLSearchParams();
    if (paperType) params.append("paperType", paperType);
    if (keyword) params.append("keyword", keyword);
    params.append("page", page);
    params.append("size", size);

    return await privateApi.get(`/api/category-papers?${params.toString()}`);
  },

  // Get a single category paper by ID
  getCategoryPaperById: async (id) => {
    return await privateApi.get(`/api/category-papers/${id}`);
  },

  // Create a new category paper
  createCategoryPaper: async (data) => {
    return await privateApi.post("/api/category-papers", data);
  },

  // Update a category paper by ID
  updateCategoryPaper: async (id, data) => {
    return await privateApi.put(`/api/category-papers/${id}`, data);
  },

  // Delete a category paper by ID
  deleteCategoryPaper: async (id) => {
    return await privateApi.delete(`/api/category-papers/${id}`);
  },

  // Get all paper templates with pagination and filtering
  getPaperTemplates: async (categoryId, paperSize, keyword, page, size) => {
    const params = new URLSearchParams();
    if (categoryId) params.append("categoryId", categoryId);
    if (paperSize) params.append("paperSize", paperSize);
    if (keyword) params.append("keyword", keyword);
    params.append("page", page);
    params.append("size", size);

    return await privateApi.get(`/api/paper-templates?${params.toString()}`);
  },

  // Get a single paper template by ID
  getPaperTemplateById: async (id) => {
    return await privateApi.get(`/api/paper-templates/${id}`);
  },

  // Create a new paper template
  createPaperTemplate: async (data) => {
    return await privateApi.post("/api/paper-templates", data);
  },

  // Update a paper template by ID
  updatePaperTemplate: async (id, data) => {
    return await privateApi.put(`/api/paper-templates/${id}`, data);
  },

  // Delete a paper template by ID
  deletePaperTemplate: async (id) => {
    return await privateApi.delete(`/api/paper-templates/${id}`);
  },
};
