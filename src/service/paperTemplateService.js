import { PaperTemplateApiController } from "../api/paperTemplateApiController";

export const paperTemplateService = {
    // Get all category papers with pagination and filtering
    getCategoryPapers: async (paperType = "", keyword = "", page = 0, size = 10) => {
        try {
            const res = await PaperTemplateApiController.getCategoryPapers(
                paperType,
                keyword,
                page,
                size
            );
            return res.data.result;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to get category papers.";
            throw new Error(message);
        }
    },

    // Get a single category paper by ID
    getCategoryPaperById: async (id) => {
        try {
            const res = await PaperTemplateApiController.getCategoryPaperById(id);
            return res.data.result;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to get category paper.";
            throw new Error(message);
        }
    },

    // Create a new category paper
    createCategoryPaper: async (data) => {
        try {
            const res = await PaperTemplateApiController.createCategoryPaper(data);
            return res.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create category paper.";
            throw new Error(message);
        }
    },

    // Update a category paper by ID
    updateCategoryPaper: async (id, data) => {
        try {
            const res = await PaperTemplateApiController.updateCategoryPaper(id, data);
            return res.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to update category paper.";
            throw new Error(message);
        }
    },

    // Delete a category paper by ID
    deleteCategoryPaper: async (id) => {
        try {
            const res = await PaperTemplateApiController.deleteCategoryPaper(id);
            return res.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to delete category paper.";
            throw new Error(message);
        }
    },

    // Get all paper templates with pagination and filtering
    getPaperTemplates: async (categoryId = "", paperSize = "", keyword = "", page = 0, size = 10) => {
        try {
            const res = await PaperTemplateApiController.getPaperTemplates(
                categoryId,
                paperSize,
                keyword,
                page,
                size
            );
            return res.data.result;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to get paper templates.";
            throw new Error(message);
        }
    },

    // Get a single paper template by ID
    getPaperTemplateById: async (id) => {
        try {
            const res = await PaperTemplateApiController.getPaperTemplateById(id);
            return res.data.result;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to get paper template.";
            throw new Error(message);
        }
    },

    // Create a new paper template
    createPaperTemplate: async (data) => {
        try {
            const res = await PaperTemplateApiController.createPaperTemplate(data);
            return res.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create paper template.";
            throw new Error(message);
        }
    },

    // Update a paper template by ID
    updatePaperTemplate: async (id, data) => {
        try {
            const res = await PaperTemplateApiController.updatePaperTemplate(id, data);
            return res.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to update paper template.";
            throw new Error(message);
        }
    },

    // Delete a paper template by ID
    deletePaperTemplate: async (id) => {
        try {
            const res = await PaperTemplateApiController.deletePaperTemplate(id);
            return res.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to delete paper template.";
            throw new Error(message);
        }
    },
};
