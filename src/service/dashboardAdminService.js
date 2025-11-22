import { dashboardAdminApiController } from "../api/dashboardAdminApiController";

export const dashboardAminService = {
    fetchUser : async () =>{
       try {
        const response = await dashboardAdminApiController.fetchUser();
        return response.data.result;
       } catch (error) {
        const message =
        error.response?.data?.message || error.message || "Get users failed.";
      throw new Error(message);
       } 
    },
    fetchRevenue : async (start, end, groupBy, type) =>{
        try {
            const response = await dashboardAdminApiController.fetchRevenue(start, end, groupBy, type);
            return response.data.result;
        } catch (error) {
            const message =
            error.response?.data?.message || error.message || "Get revenue failed.";
          throw new Error(message);
        }
    },
    fetchTotalOrderAndEnrollments: async () => {
        try {
            const response = await dashboardAdminApiController.fetchTotalOrderAndEnrollments();
            return response.data.result;
        } catch (error) {
            const message =
            error.response?.data?.message || error.message || "Get total order and enrollments failed.";
          throw new Error(message);
        }
    },
    fetchTopCourses: async (limit) => {
        try {
            const response = await dashboardAdminApiController.fetchTopCourses(limit);
            return response.data.result;
        } catch (error) {
            const message =
            error.response?.data?.message || error.message || "Get top courses failed.";
          throw new Error(message);
        }
    },
    fetchTopResources: async (limit) => {
        try {
            const response = await dashboardAdminApiController.fetchTopResources(limit);
            return response.data.result;
        } catch (error) {
            const message =
            error.response?.data?.message || error.message || "Get top resources failed.";
          throw new Error(message);
        }
    },
    fetchTopDesigners: async (limit) => {
        try {
            const response = await dashboardAdminApiController.fetchTopDesigners(limit);
            return response.data.result;
        } catch (error) {
            const message =
            error.response?.data?.message || error.message || "Get top designers failed.";
          throw new Error(message);
        }
    },
}