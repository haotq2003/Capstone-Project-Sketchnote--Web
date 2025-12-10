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
};
