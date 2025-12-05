import { privateApi } from "./axiosIntance";

export const withdrawalsApiController = {
    getWithdrawals: async (search,status, page, size, sortBy = "createAt", sortDir = "desc") => {
        return await privateApi.get(`/api/admin/withdraw/all`, {
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
    approveWithdrawal: async (id) => {
        return await privateApi.put(`/api/admin/withdraw/${id}/approve`);
    },
    rejectWithdrawal: async (id) => {
        return await privateApi.put(`/api/admin/withdraw/${id}/reject`);
    },

}