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
    getBankList: async () => {
        try {
            const res = await walletApiController.getBankList();
            return res.data;
        } catch (error) {
            const message =
            error.response?.data?.message || error.message || "Get bank list failed.";
          throw new Error(message);
        }
    },
    getBankAccountByUserId: async () => {
        try {
            const res = await walletApiController.getBankAccountByUserId();
            return res.data;
        } catch (error) {
            const message =
            error.response?.data?.message || error.message || "Get bank account by user id failed.";
          throw new Error(message);
        }
    },
    createBankAccount: async (data) => {
        try {
            const res = await walletApiController.createBankAccount(data);
            return res.data;
        } catch (error) {
            const message =
            error.response?.data?.message || error.message || "Create bank account failed.";
          throw new Error(message);
        }
    },
    updateBankAccount: async (data) => {
        try {
            const res = await walletApiController.updateBankAccount(data);
            return res.data;
        } catch (error) {
            const message =
            error.response?.data?.message || error.message || "Update bank account failed.";
          throw new Error(message);
        }
    },
    deleteBankAccount: async (id) => {
        try {
            const res = await walletApiController.deleteBankAccount(id);
            return res.data;
        } catch (error) {
            const message =
            error.response?.data?.message || error.message || "Delete bank account failed.";
          throw new Error(message);
        }
    },

}