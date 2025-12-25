import { withdrawalsApiController } from "../api/withdrawApiController";

export const withdrawalsService = {
    getWithdrawals: async (search,status, page, size, sortBy = "createdAt", sortDir = "desc") => {
       try {
          const res = await withdrawalsApiController.getWithdrawals(search,status, page, size, sortBy, sortDir);
          return res.data.result;
       } catch (error) {
         const message =
           error.response?.data?.message || error.message || "Get withdrawals failed.";
      throw new Error(message);
       }
    },
    approveWithdrawal: async (id,billImage) => {
       try {
          const res = await withdrawalsApiController.approveWithdrawal(id,billImage);
          return res.data.result;
       } catch (error) {
         const message =
           error.response?.data?.message || error.message || "Approve withdrawal failed.";
      throw new Error(message);
       }
    },
    rejectWithdrawal: async (id,rejectReason) => {
       try {
          const res = await withdrawalsApiController.rejectWithdrawal(id,rejectReason);
          return res.data.result;
       } catch (error) {
         const message =
           error.response?.data?.message || error.message || "Reject withdrawal failed.";
      throw new Error(message);
       }
    },
}