import { privateApi, publicApi } from "./axiosIntance";

export const creditController = {
  getAllCreditPackages : async() =>{
return await privateApi.get("/api/credit-packages/admin/all");
  },
  getCreditPackageById : async(id) =>{
    return await privateApi.get(`/api/credit-packages/${id}`);
  },
  createCreditPackage : async(data) =>{
    return await privateApi.post("/api/credit-packages/admin", data);
  },
  updateCreditPackage : async(id, data) =>{
    return await privateApi.put(`/api/credit-packages/admin/${id}`, data);
  },
  deleteCreditPackage : async(id) =>{
    return await privateApi.delete(`/api/credit-packages/admin/${id}`);
  },
  activeCreditPackage : async(id) =>{
    return await privateApi.patch(`/api/credit-packages/admin/${id}/toggle`);
  },
};
