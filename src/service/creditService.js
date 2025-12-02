import { creditController } from "../api/creditApiController";

export const creditService = {
  getAllCreditPackages : async() =>{
    try {
      const res = await creditController.getAllCreditPackages();
      return res.data.result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Get all courses failed.";
      throw new Error(message);
    }
   },
  
  getCreditPackageById : async(id) =>{
    try {
      const res = await creditController.getCreditPackageById(id);
      return res.data.result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Get credit package failed.";
      throw new Error(message);
    }
  },
  createCreditPackage : async(data) =>{
    try {
      const res = await creditController.createCreditPackage(data);
      return res.data.result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Create credit package failed.";
      throw new Error(message);
    }
  },
  updateCreditPackage : async(id, data) =>{
    try {
      const res = await creditController.updateCreditPackage(id, data);
      return res.data.result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Update credit package failed.";
      throw new Error(message);
    }
  },
  deleteCreditPackage : async(id) =>{
    try {
      const res = await creditController.deleteCreditPackage(id);
      return res.data.result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Delete credit package failed.";
      throw new Error(message);
    }
  },
  activeCreditPackage : async(id) =>{
    try {
      const res = await creditController.activeCreditPackage(id);
      return res.data.result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Active credit package failed.";
      throw new Error(message);
    }
  },
};