import { dashboardAdminApiController } from "../api/dashboardAdminApiController";

export const dashboardAminService = {
    fetchUser: async () => {
        try {
            const response = await dashboardAdminApiController.fetchUser();
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get users failed.";
            throw new Error(message);
        }
    },
    fetchRevenue: async (start, end, groupBy, type) => {
        try {
            const response = await dashboardAdminApiController.fetchRevenue(start, end, groupBy, type);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get revenue failed.";
            throw new Error(message);
        }
    },
    fetchTotalOrderAndEnrollments: async () => {
        try {
            const response = await dashboardAdminApiController.fetchTotalOrderAndEnrollments();
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get total order and enrollments failed.";
            throw new Error(message);
        }
    },
    fetchTopCourses: async (limit) => {
        try {
            const response = await dashboardAdminApiController.fetchTopCourses(limit);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get top courses failed.";
            throw new Error(message);
        }
    },
    fetchTopResources: async (limit) => {
        try {
            const response = await dashboardAdminApiController.fetchTopResources(limit);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get top resources failed.";
            throw new Error(message);
        }
    },
    fetchTopDesigners: async (limit) => {
        try {
            const response = await dashboardAdminApiController.fetchTopDesigners(limit);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get top designers failed.";
            throw new Error(message);
        }
    },
    getALlWalletOfUser: async (search, page, size, sortBy, sortDir) => {
        try {
            const response = await dashboardAdminApiController.getALlWalletOfUser(search, page, size, sortBy, sortDir);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get wallets failed.";
            throw new Error(message);
        }
    },
    getWalletByUserId: async (userId) => {
        try {
            const response = await dashboardAdminApiController.getWalletByUserId(userId);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get wallet failed.";
            throw new Error(message);
        }
    },
    getAllTransactions: async (search, type, page, size, sortBy, sortDir) => {
        try {
            const response = await dashboardAdminApiController.getAllTransactions(search, type, page, size, sortBy, sortDir);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get transactions failed.";
            throw new Error(message);
        }
    },
    getTransactionByUserId: async (userId, page, size) => {
        try {
            const response = await dashboardAdminApiController.getTransactionByUserId(userId, page, size);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get user transactions failed.";
            throw new Error(message);
        }
    },
    getAllSubscriptionsTransaction: async (search, status, page, size, sortBy, sortDir) => {
        try {
            const response = await dashboardAdminApiController.getAllSubscriptionsTransaction(search, status, page, size, sortBy, sortDir);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get subscription transactions failed.";
            throw new Error(message);
        }
    },
    getSubscriptionTransactionByUserId: async (userId, page, size) => {
        try {
            const response = await dashboardAdminApiController.getSubscriptionTransactionByUserId(userId, page, size);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get subscription transaction by user id failed.";
            throw new Error(message);
        }
    },
    getAllCreditTransactions: async (search, type, page, size, sortBy, sortDir) => {
        try {
            const response = await dashboardAdminApiController.getAllCreditTransactions(search, type, page, size, sortBy, sortDir);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get credit transactions failed.";
            throw new Error(message);
        }
    },
    getCreditTransactionByUserId: async (userId, page, size) => {
        try {
            const response = await dashboardAdminApiController.getCreditTransactionByUserId(userId, page, size);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get credit transaction by user id failed.";
            throw new Error(message);
        }
    },
    getAllOrderTransaction: async (search, orderStatus, paymentStatus, page, size, sortBy, sortDir) => {
        try {
            const response = await dashboardAdminApiController.getAllOrderTransaction(search, orderStatus, paymentStatus, page, size, sortBy, sortDir);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get order transactions failed.";
            throw new Error(message);
        }
    },

    getAllUser: async (search, role, page, size, sortBy, sortDir) => {
        try {
            const response = await dashboardAdminApiController.getAllUser(search, role, page, size, sortBy, sortDir);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get users failed.";
            throw new Error(message);
        }
    },

    ////////////////////////////
    ////////// revenue /////////
    ////////////////////////////
    getTopTokenPackages: async (limit) => {
        try {
            const response = await dashboardAdminApiController.getTopTokenPackages(limit);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get top token packages failed.";
            throw new Error(message);
        }
    },
    getTopSubscriptions: async (limit) => {
        try {
            const response = await dashboardAdminApiController.getTopSubscriptions(limit);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get top subscriptions failed.";
            throw new Error(message);
        }
    },
    getRevenueDashboard: async (start, end, groupBy, type) => {
        try {
            const response = await dashboardAdminApiController.getRevenueDashboard(start, end, groupBy, type);
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get revenue dashboard failed.";
            throw new Error(message);
        }
    },
    getDashboardOverview: async () => {
        try {
            const response = await dashboardAdminApiController.getDashboardOverview();
            return response.data.result;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Get dashboard overview failed.";
            throw new Error(message);
        }
    },

};
