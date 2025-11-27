import React, { useEffect, useState } from "react";
import { Send, Smile, Paperclip, Search, MoreVertical } from "lucide-react";
import { chatService } from "../../service/chatService";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputText, setInputText] = useState("");
  const [conversations2, setConversations2] = useState(null);
  const [messages, setMessages] = useState([]);

  const fetchAllConversations = async () => {
    try {
      const response = await chatService.getConversations();
      setConversations2(response);
      console.log("Conversations:", response);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const getConversationById = async (userId) => {
    try {
      const response = await chatService.getMessagesByUserId(userId, 0, 20);
      console.log("Messages:", response.content);
      // Đảo ngược thứ tự để tin nhắn mới nhất ở dưới
      setMessages(response.content.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchAllConversations();
  }, []);

  const handleSelectChat = (conversation) => {
    setSelectedChat(conversation);
    getConversationById(conversation.userId);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedChat) return;

    try {
      const data = {
        receiverId: selectedChat.userId,
        content: inputText,
      };

      const response = await chatService.sendMessage(data);
      console.log("Message sent:", response);

      // Thêm tin nhắn mới vào danh sách
      const newMessage = {
        id: Date.now(),
        content: inputText,
        senderId: "currentUserId", // Thay bằng ID người dùng hiện tại
        receiverId: selectedChat.userId,
        createdAt: new Date().toISOString(),
      };

      setMessages([...messages, newMessage]);
      setInputText("");

      // Cập nhật lại danh sách conversations
      fetchAllConversations();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Hàm để xác định tin nhắn là của mình hay người khác
  const isMyMessage = (message) => {
    // Giả sử bạn có currentUserId - thay thế bằng ID thực của người dùng hiện tại
    // return message.senderId === currentUserId;
    return message.senderId !== selectedChat?.userId;
  };
const formatTime = (timeString) => {
  if (!timeString) return "";

  return new Date(timeString).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  });
};

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Danh sách cuộc trò chuyện */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="px-4 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tin nhắn</h1>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm cuộc trò chuyện..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations2?.map((conv) => {
            const avatarText = conv.userName
              ? conv.userName.charAt(0).toUpperCase()
              : "?";

          const timeFormatted = formatTime(conv.lastMessageTime);


            return (
              <div
                key={conv.userId}
                onClick={() => handleSelectChat(conv)}
                className={`px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedChat?.userId === conv.userId ? "bg-blue-50" : ""
                }`}
              >
                {/* Avatar */}
                <div className="relative">
                  {conv.userAvatarUrl ? (
                    <img
                      src={conv.userAvatarUrl}
                      alt={conv.userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-blue-500">
                      {avatarText}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {conv.userName}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2">
                      {timeFormatted}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.lastMessage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {selectedChat.userAvatarUrl ? (
                      <img
                        src={selectedChat.userAvatarUrl}
                        alt={selectedChat.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-blue-500">
                        {selectedChat.userName?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {selectedChat.userName}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {selectedChat.online
                        ? "Đang hoạt động"
                        : "Không hoạt động"}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages?.map((message) => {
                const isMine = isMyMessage(message);
                
                // Chuyển UTC sang giờ Việt Nam (UTC+7)
                const messageTime = formatTime(message.createdAt);


                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-md ${
                        isMine ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      {!isMine && (
                        <div className="w-8 h-8 rounded-full flex-shrink-0">
                          {selectedChat.userAvatarUrl ? (
                            <img
                              src={selectedChat.userAvatarUrl}
                              alt={selectedChat.userName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold bg-blue-500">
                              {selectedChat.userName?.charAt(0).toUpperCase() ||
                                "?"}
                            </div>
                          )}
                        </div>
                      )}
                      <div>
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isMine
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p
                          className={`text-xs text-gray-500 mt-1 ${
                            isMine ? "text-right" : "text-left"
                          }`}
                        >
                          {messageTime}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex items-end space-x-3">
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Paperclip size={20} />
                </button>
                <div className="flex-1 bg-gray-100 rounded-3xl px-4 py-2 flex items-center">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
                  />
                  <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                    <Smile size={20} />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={40} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Tin nhắn của bạn
              </h2>
              <p className="text-gray-600">
                Chọn một cuộc trò chuyện để bắt đầu nhắn tin
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;