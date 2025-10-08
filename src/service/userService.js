import { userApiController } from "../api/userApiController";

export const userService = {
    fetchUsers: async () => {
        try {
           const res = await userApiController.getAllUser();
            return res.data;
        } catch (error) {
            const message =
           error.response?.data?.message || error.message || "Get all user failed.";
      throw new Error(message);
        }
    },
}