import { privateApi } from "./axiosIntance";


export const chatApiController = {
    sendMessage: async (data) => {
     return await privateApi.post('/api/messages', data)
    },
   getMessagesByUserId: async (userId, page, size) => {
  return await privateApi.get(
    `/api/messages/conversation/${userId}?page=${page}&size=${size}`
  );
},
 getConversations: async () => {
  return await privateApi.get('/api/messages/conversations')

 }
}