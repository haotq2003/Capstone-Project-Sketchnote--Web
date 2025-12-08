import { walletApiController } from "../api/walletApiController";

export const walletService = {
    getWallet: async () => {
     try {
        const  res = await walletApiController.getWallet();
        return res.data;
     } catch (error) {
        const message =
        error.response?.data?.message || error.message || "Get wallet failed.";
      throw new Error(message);
     }
    },
    depositWallet: async (amount) => {
        try {
            const res = await walletApiController.depositWallet(amount);
            return res.data;
        } catch (error) {
            const message =
            error.response?.data?.message || error.message || "Deposit wallet failed.";
          throw new Error(message);
        }
    },
    withdrawRequest: async (data) => {
        try {
            const res = await walletApiController.withdrawRequest(data);
            return res.data.result;
        } catch (error) {
            const message =
            error.response?.data?.message || error.message || "Withdraw request failed.";
          throw new Error(message);
        }
    },
    getWithdrawHistory: async (page,size,sortBy,sortDirection) => {
        try {
            const res = await walletApiController.getWithdrawHistory(page,size,sortBy,sortDirection);
            return res.data.result;
        } catch (error) {
            const message =
            error.response?.data?.message || error.message || "Get withdraw history failed.";
          throw new Error(message);
        }
    },
}