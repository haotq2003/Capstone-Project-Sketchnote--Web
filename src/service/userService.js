import { userApiController } from "../api/userApiController";

export const userService = {
    fetchUsers: async (pageNo, pageSize) => {
        try {
           const res = await userApiController.getAllUser(pageNo, pageSize);
            return res.data;
        } catch (error) {
            const message =
           error.response?.data?.message || error.message || "Get all user failed.";
      throw new Error(message);
        }
    },  
    fetchUserById: async (id) => {
        try {
           const res = await userApiController.getUserById(id);
            return res.data;
        } catch (error) {
            const message =
           error.response?.data?.message || error.message || "Get user by id failed.";
      throw new Error(message);
        }
    },  
    fetchRole: async () => {
        try {
           const res = await userApiController.getRole();
            return res.data.result;
        } catch (error) {
            const message =
           error.response?.data?.message || error.message || "Get role failed.";
      throw new Error(message);
        }
    },
    updateUserRole: async (role) => {
        try {
           const res = await userApiController.updateUserRole(role);
            return res.data;
        } catch (error) {
            const message =
           error.response?.data?.message || error.message || "Update user role failed.";
      throw new Error(message);
        }
    },
    deleteUser: async (id) => {
        try {
           const res = await userApiController.deleteUser(id);
            return res.data.result;
        } catch (error) {
            const message =
           error.response?.data?.message || error.message || "Delete user failed.";
      throw new Error(message);
        }
    },
}