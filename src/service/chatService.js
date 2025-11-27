import { chatApiController } from "../api/chatApiController";

export const chatService = {
    sendMessage : async (data) =>{
        try {
            const response = await chatApiController.sendMessage(data)
            return response.data.result;
        } catch (error) {
            const message =
        error.response?.data?.message || error.message || "Send message failed.";
      throw new Error(message);
        }
    },
    getMessagesByUserId: async (userId, page, size) => {
        try {
            const response = await chatApiController.getMessagesByUserId(userId, page, size)
            return response.data.result;
        } catch (error) {
            const message =
        error.response?.data?.message || error.message || "Get messages by user id failed.";
      throw new Error(message);
        }
    },
    getConversations: async () => {
        try {
            const response = await chatApiController.getConversations()
            return response.data.result;
        } catch (error) {
            const message =
        error.response?.data?.message || error.message || "Get conversations failed.";
      throw new Error(message);
        }
    },
}