import { privateApi } from "./axiosIntance";

export const dashboardAdminApiController = {
    fetchUser: async () => {
        return await privateApi.get(`/api/orders/admin/dashboard/users`);
    },
    fetchRevenue: async (start, end, groupBy, type) => {
        return await privateApi.get(`/api/orders/admin/dashboard/revenue`,{
            params:{
                start,
                end,
                groupBy,
                type
            },
        });
    },
    fetchTotalOrderAndEnrollments: async () => {
        return await privateApi.get(`/api/orders/admin/dashboard/overview`);
    },
    fetchTopCourses: async (limit) => {
        return await privateApi.get(`/api/orders/admin/dashboard/top-courses`,{
            params:{
                limit
            },
        });
    },
    fetchTopResources: async (limit) => {
        return await privateApi.get(`/api/orders/admin/dashboard/top-resources`,{
            params:{
                limit
            },
        });
    },
    fetchTopDesigners: async (limit) => {
        return await privateApi.get(`/api/orders/admin/dashboard/top-designers`,{
            params:{
                limit
            },
        });
    },
}