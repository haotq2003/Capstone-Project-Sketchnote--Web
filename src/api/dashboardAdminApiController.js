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
   getALlWalletOfUser: async (search, page, size, sortBy, sortDir) => {
    return await privateApi.get(`/api/admin/dashboard/wallets`, {
        params: {
            search,
            page,
            size,
            sortBy,
            sortDir
        }
    });
},
getWalletByUserId: async (userId) => {
    return await privateApi.get(`/api/admin/dashboard/wallets/${userId}`);
},
getAllTransactions: async (search, type, page, size, sortBy, sortDir) => {
    return await privateApi.get(`/api/admin/dashboard/transactions`, {
        params: {
            search,
            type,
            page,
            size,
            sortBy,
            sortDir
        }
    });
},
getTransactionByUserId: async (userId, page, size) => {
    return await privateApi.get(`/api/admin/dashboard/transactions/${userId}`, {
        params: {
         
            page,
            size,
          
        }
    });
},
getAllSubscriptionsTransaction: async (search, status,page, size, sortBy, sortDir) => {
    return await privateApi.get(`/api/admin/dashboard/subscriptions`, {
        params: {
            search,
            status,
            page,
            size,
            sortBy,
            sortDir
        }
    });
},

getSubscriptionTransactionByUserId: async (userId, page, size) => {
    return await privateApi.get(`/api/admin/dashboard/subscriptions/${userId}`, {
        params: {
         
            page,
            size,
          
        }
    });
},

getAllCreditTransactions: async (search, type, page, size, sortBy, sortDir) => {
    return await privateApi.get(`/api/admin/dashboard/credit-transactions`, {
        params: {
            search,
            type,
            page,
            size,
            sortBy,
            sortDir
        }
    });
},
getCreditTransactionByUserId: async (userId, page, size) => {
    return await privateApi.get(`/api/admin/dashboard/credit-transactions/${userId}`, {
        params: {
         
            page,
            size,
          
        }
    });
},
getAllOrderTransaction: async (search, orderStatus,paymentStatus,page, size, sortBy, sortDir) => {
    return await privateApi.get(`/api/orders/admin/dashboard/orders`, {
        params: {
            search,
            page,
            size,
            sortBy,
            sortDir,
            orderStatus,
            paymentStatus
        }
    });
},
getAllUser: async (search, role, page, size, sortBy = "createAt", sortDir) => {
    return await privateApi.get(`/api/admin/dashboard/users`, {
        params: {
            search,
            role,
            page,
            size,
            sortBy,
            sortDir
        }
    });
},
/////////////////////////////////////////////////////////////////////////

getTopTokenPackages: async (limit) => {
    return await privateApi.get(`/api/admin/revenue/top-token-packages`,{
        params:{
            limit
        },
    });
},
getTopSubscriptions: async (limit) => {
    return await privateApi.get(`/api/admin/revenue/top-subscriptions`,{
        params:{
            limit
        },
    });
},
getDashboardOverview: async () => {
    return await privateApi.get(`/api/admin/revenue/overview`);
},


getRevenueDashboard: async (start, end, groupBy, type) => {
    return await privateApi.get(`/api/admin/revenue/dashboard`,{
        params:{
            start,
            end,
            groupBy,
            type
        },
    });
},
}
