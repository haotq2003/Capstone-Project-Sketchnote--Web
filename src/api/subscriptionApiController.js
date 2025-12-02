import { privateApi } from "./axiosIntance";

export const subscriptionController = {
  getAllSubscriptions : async() =>{
    return await privateApi.get("/api/subscription-plans");
  },
  getSubscriptionById : async(id) =>{
    return await privateApi.get(`/api/subscription-plans/${id}`);
  },
  createSubscription : async(data) =>{
    return await privateApi.post("/api/subscription-plans", data);
  },
  updateSubscription : async(id, data) =>{
    return await privateApi.put(`/api/subscription-plans/${id}`, data);
  },
  deleteSubscription : async(id) =>{
    return await privateApi.delete(`/api/subscription-plans/${id}`);
  },
  activeSubscription : async(id) =>{
    return await privateApi.patch(`/api/subscription-plans/${id}/toggle`);
  },
};