import { ResourceApiController } from "../api/resourceApiController"

export const resourceService = {
  uploadRecource : async (template) =>{
    try {
        const res = await ResourceApiController.uploadResource(template);
        return res.data;
    } catch (error) {
          const message =
           error.response?.data?.message || error.message || "Upload resource failed.";
      throw new Error(message);
    }
  },
  getResourceByUserId : async (page,size) =>{
    try {
        const res = await ResourceApiController.getResourceByUserId(page,size);
        return res.data.result;
    } catch (error) {
          const message =
           error.response?.data?.message || error.message || "Get resource failed.";
      throw new Error(message);
    }
  },
  acceptResource : async (resourceId) =>{
    try {
        const res = await ResourceApiController.acceptResource(resourceId);
        return res.data;
    } catch (error) {
          const message =
           error.response?.data?.message || error.message || "Accept resource failed.";
      throw new Error(message);
    }
  },
  rejectResource : async (resourceId) =>{
    try {
        const res = await ResourceApiController.rejectResource(resourceId);
        return res.data;
    } catch (error) {
          const message =
           error.response?.data?.message || error.message || "Reject resource failed.";
      throw new Error(message);
    }
  },
  getResourceByStatus : async (status,page,size,sortBy,sortDir) =>{
    try {
        const res = await ResourceApiController.getResourceByStatus(status,page,size,sortBy,sortDir);
        return res.data.result;
    } catch (error) {
          const message =
           error.response?.data?.message || error.message || "Get resource failed.";
      throw new Error(message);
    }
  },
 
  getResourceVersion : async (page,size) =>{
    try {
        const res = await ResourceApiController.getResourceVersion(page,size);
        return res.data.result;
    } catch (error) {
          const message =
           error.response?.data?.message || error.message || "Get resource failed.";
      throw new Error(message);
    }
  },
  ReviewResourceVersion : async (resourceId,data) =>{
    try {
        const res = await ResourceApiController.ReviewResourceVersion(resourceId,data);
        return res.data;
    } catch (error) {
          const message =
           error.response?.data?.message || error.message || "Review resource failed.";
      throw new Error(message);
    }
  },
}