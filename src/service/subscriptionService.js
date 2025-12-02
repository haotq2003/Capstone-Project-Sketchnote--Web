import { subscriptionController } from "../api/subscriptionApiController";

export const subscriptionService = {
  getAllSubscriptions : async() =>{
    try {
      const res = await subscriptionController.getAllSubscriptions();
      return res.data.result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Get all subscriptions failed.";
      throw new Error(message);
    }
  },
  getSubscriptionById : async(id) =>{
    try {
      const res = await subscriptionController.getSubscriptionById(id);
      return res.data.result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Get subscription by id failed.";
      throw new Error(message);
    }
  },
  createSubscription : async(data) =>{
    try {
      const res = await subscriptionController.createSubscription(data);
      return res.data.result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Create subscription failed.";
      throw new Error(message);
    }
  },
  updateSubscription : async(id, data) =>{
    try {
      const res = await subscriptionController.updateSubscription(id, data);
      return res.data.result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Update subscription failed.";
      throw new Error(message);
    }
  },
  deleteSubscription : async(id) =>{
    try {
      const res = await subscriptionController.deleteSubscription(id);
      return res.data.result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Delete subscription failed.";
      throw new Error(message);
    }
  },
  activeSubscription : async(id) =>{
    try {
      const res = await subscriptionController.activeSubscription(id);
      return res.data.result;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Active subscription failed.";
      throw new Error(message);
    }
  },
}