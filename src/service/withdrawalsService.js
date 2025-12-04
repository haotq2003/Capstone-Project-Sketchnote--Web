import { withdrawalsApiController } from "../api/withdrawApiController";

export const withdrawalsService = {
    getWithdrawals: async (search,status, page, size, sortBy = "createAt", sortDir = "desc") => {
       try {
          const res = await withdrawalsApiController.getWithdrawals(search,status, page, size, sortBy, sortDir);
          return res.data.result;
       } catch (error) {
         const message =
           error.response?.data?.message || error.message || "Get withdrawals failed.";
      throw new Error(message);
       }
    },
    approveWithdrawal: async (id) => {
       try {
          const res = await withdrawalsApiController.approveWithdrawal(id);
          return res.data.result;
       } catch (error) {
         const message =
           error.response?.data?.message || error.message || "Approve withdrawal failed.";
      throw new Error(message);
       }
    },
    rejectWithdrawal: async (id) => {
       try {
          const res = await withdrawalsApiController.rejectWithdrawal(id);
          return res.data.result;
       } catch (error) {
         const message =
           error.response?.data?.message || error.message || "Reject withdrawal failed.";
      throw new Error(message);
       }
    },
}