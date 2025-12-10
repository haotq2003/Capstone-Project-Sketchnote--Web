import { privateApi } from "./axiosIntance";
import axios from "axios";

export const walletApiController = {
     getWallet: async () => {
    return await privateApi.get("/api/wallet/my-wallet");
  },
  depositWallet: async (amount) => {
    return await privateApi.post(`/api/payment/deposit?amount=${amount}`, null);
  },
  withdrawRequest: async (data) => {
    return await privateApi.post(`/api/withdraw/request`, data);
  },
  getWithdrawHistory: async (page,size,sortBy,sortDirection) => {
    return await privateApi.get(`/api/withdraw/my-history?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
  },
  getBankList: async () => {
    // Gọi trực tiếp VietQR API (public API)
    return await axios.get("https://api.vietqr.io/v2/banks");
  },
  getBankAccountByUserId: async () => {
    return await privateApi.get(`/api/bank-accounts`);
  },
  createBankAccount: async (data) => {
    return await privateApi.post(`/api/bank-accounts`, data);
  },
  updateBankAccount: async (data) => {
    return await privateApi.put(`/api/bank-accounts`, data);
  },
  deleteBankAccount: async (id) => {
    return await privateApi.delete(`/api/bank-accounts/${id}`);
  },
}