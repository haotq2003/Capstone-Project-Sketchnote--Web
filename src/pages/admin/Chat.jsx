import React, { useEffect, useState, useRef } from "react";
import { Send, Smile, Image as ImageIcon, Search, MoreVertical, X, Loader2 } from "lucide-react";
import { chatService } from "../../service/chatService";
import { webSocketService } from "../../service/webSocketService";
import { authService } from "../../service/authService";
import { uploadService } from "../../service/uploadService";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputText, setInputText] = useState("");
  const [conversations2, setConversations2] = useState(null);
  const [messages, setMessages] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const subscriptionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);

  // Use refs to avoid closure issues in WebSocket callback
  const selectedChatRef = useRef(null);
  const currentUserIdRef = useRef(null);

  // Get current user ID from backend profile
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const profile = await authService.getProfile();
        if (profile && profile.id) {
          setCurrentUserId(profile.id);
          currentUserIdRef.current = profile.id; // Update ref
        }
      } catch (error) {
        console.error("Error fetching current user profile:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Connect to WebSocket
  useEffect(() => {
    if (!currentUserId) {
      console.log("[Chat] No currentUserId yet, skip WebSocket connect");
      return;
    }

    // Build WebSocket URL from API base URL
    const apiUrl = import.meta.env.VITE_API_URL; // e.g. https://sketchnote.litecsys.com/
    const wsUrl = apiUrl.replace(/^http/, "ws") + "ws"; // -> wss://sketchnote.litecsys.com/ws
    console.log(
      "[Chat] Connecting WebSocket to:",
      wsUrl,
      "for user:",
      currentUserId
    );

    webSocketService.connect(
      wsUrl,
      () => {
        console.log("✅ Connected to WebSocket (Chat.jsx)");
        setWsConnected(true);

        // Subscribe to private messages for current user
        const subId = webSocketService.subscribe(
          `/queue/private/${currentUserId}`,
          (message) => {
            console.log("📨 Received WebSocket message:", message);
            handleIncomingMessage(message);
          }
        );
        subscriptionRef.current = subId;
      },
      (error) => {
        console.error("❌ WebSocket connection error (Chat.jsx):", error);
        setWsConnected(false);
      }
    );

    // Cleanup on unmount
    return () => {
      if (subscriptionRef.current) {
        webSocketService.unsubscribe(subscriptionRef.current);
      }
      webSocketService.disconnect();
    };
  }, [currentUserId]);

  // Handle incoming WebSocket messages
  const handleIncomingMessage = (message) => {
    console.log("📨 Processing incoming message:", message);

    // Use refs to get latest values (avoid closure issue)
    const currentSelected = selectedChatRef.current;
    const currentUser = currentUserIdRef.current;

    console.log("🔍 Current state:", {
      currentUserId: currentUser,
      selectedChatUserId: currentSelected?.userId,
      selectedChatUserName: currentSelected?.userName,
      messageSenderId: message.senderId,
      messageReceiverId: message.receiverId,
    });

    if (message.senderId === currentUser) {
      console.log(
        "⚠️ Skipping message from myself (already added optimistically)"
      );
      // Vẫn update conversations list
      fetchAllConversations();
      return;
    }

    const isForCurrentConversation =
      currentSelected &&
      message.senderId === currentSelected.userId &&
      message.receiverId === currentUser;

    console.log("✅ isForCurrentConversation:", isForCurrentConversation);

    if (isForCurrentConversation) {
      setMessages((prevMessages) => {
        // Check if message already exists (để tránh duplicate)
        const exists = prevMessages.some((msg) => {
          if (msg.id && message.id) {
            return msg.id === message.id;
          }
          return (
            msg.content === message.content &&
            msg.senderId === message.senderId &&
            Math.abs(
              new Date(msg.createdAt) -
              new Date(message.timestamp || message.createdAt)
            ) < 1000
          );
        });

        if (exists) {
          console.log("⚠️ Message already exists, skipping");
          return prevMessages;
        }

        console.log("✅ Adding new message to chat");

        return [
          ...prevMessages,
          {
            id: message.id,
            senderId: message.senderId,
            senderName: message.senderName,
            senderAvatarUrl: message.senderAvatarUrl,
            receiverId: message.receiverId,
            receiverName: message.receiverName,
            receiverAvatarUrl: message.receiverAvatarUrl,
            content: message.content,
            isImage: message.isImage || message.image || false,
            createdAt: message.createdAt || message.timestamp,
            updatedAt: message.updatedAt,
          },
        ];
      });
    } else {
      console.log("❌ Message is NOT for current conversation");
    }

    // Update conversations list
    fetchAllConversations();
  };
  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      // Load page 0 first to get totalPages
      const initialResponse = await chatService.getMessagesByUserId(
        userId,
        0,
        20
      );
      const totalPages = initialResponse.totalPages || 0;

      console.log(`📄 Total pages: ${totalPages}`);

      if (totalPages > 0) {
        // Load last page for newest messages
        const lastPage = totalPages - 1;
        console.log(`🔄 Loading last page (${lastPage}) for newest messages`);

        const response = await chatService.getMessagesByUserId(
          userId,
          lastPage,
          20
        );
        console.log("Messages:", response.content);

        const sortedMessages = [...response.content]
          .map(msg => ({
            ...msg,
            isImage: msg.isImage || msg.image || false, // Map 'image' field from backend to 'isImage'
          }))
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setMessages(sortedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchAllConversations();
  }, []);

  const handleSelectChat = (conversation) => {
    console.log("🎯 Selected conversation:", conversation);
    setSelectedChat(conversation);
    selectedChatRef.current = conversation; // Update ref
    getConversationById(conversation.userId);
    // Clear image preview when switching chat
    clearImagePreview();
  };

  // Image handling functions
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const clearImagePreview = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // Helper function to send a single message
  const sendSingleMessage = async (content, isImage) => {
    const data = {
      receiverId: selectedChat.userId,
      content: content,
      image: isImage,
    };

    const response = await chatService.sendMessage(data);
    console.log("Message saved to database:", response);

    const newMessage = {
      id: response.id,
      senderId: currentUserId,
      senderName: response.senderName,
      senderAvatarUrl: response.senderAvatarUrl,
      receiverId: selectedChat.userId,
      receiverName: selectedChat.userName,
      receiverAvatarUrl: selectedChat.userAvatarUrl,
      content: content,
      isImage: isImage,
      createdAt: response.createdAt || new Date().toISOString(),
      updatedAt: response.updatedAt,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Send via WebSocket
    if (wsConnected) {
      const wsMessage = {
        senderId: currentUserId,
        senderName: response.senderName,
        senderAvatarUrl: response.senderAvatarUrl,
        receiverId: selectedChat.userId,
        content: content,
        image: isImage, // Use 'image' to match Java backend field serialization
        timestamp: response.createdAt,
      };
      console.log("Message sent via WebSocket:", wsMessage);
      webSocketService.send("/app/chat.private", wsMessage);
    }

    return response;
  };

  const handleSendMessage = async () => {
    // Check if we have either text or image
    if (!selectedChat || (!inputText.trim() && !imageFile)) return;

    const messageContent = inputText.trim();
    setInputText("");

    try {
      // If there's an image, upload and send it first
      if (imageFile) {
        setUploading(true);
        try {
          const uploadResult = await uploadService.uploadImage(imageFile);
          const imageUrl = uploadResult.secure_url;
          clearImagePreview();

          // Send image message
          await sendSingleMessage(imageUrl, true);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          alert("Failed to upload image. Please try again.");
          setUploading(false);
          setInputText(messageContent); // Restore text
          return;
        }
        setUploading(false);
      }

      // If there's also text, send it as a separate message
      if (messageContent) {
        await sendSingleMessage(messageContent, false);
      }

      // Update conversations list
      fetchAllConversations();

    } catch (error) {
      console.error("Error sending message:", error);
      setInputText(messageContent);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isMyMessage = (message) => {
    return message.senderId === currentUserId;
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    // ✅ Ensure UTC parsing by adding 'Z' if missing
    const utcString = timeString.endsWith("Z") ? timeString : timeString + "Z";
    const date = new Date(utcString);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Danh sách cuộc trò chuyện */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="px-4 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
            {wsConnected ? (
              <span className="text-xs text-green-600 flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-pulse"></span>
                Connected
              </span>
            ) : (
              <span className="text-xs text-red-600 flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                Not Connected
              </span>
            )}
          </div>
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
                className={`px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer transition-colors ${selectedChat?.userId === conv.userId ? "bg-blue-50" : ""
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
                      {wsConnected ? "Đang hoạt động" : "Không hoạt động"}
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
              {messages?.map((message, index) => {
                const isMine = isMyMessage(message);

                // Chuyển UTC sang giờ Việt Nam (UTC+7)
                const messageTime = formatTime(message.createdAt);

                // Debug log
                if (!messageTime) {
                  console.warn("No time for message:", message);
                }

                return (
                  <div
                    key={message.id || `msg-${index}`}
                    className={`flex ${isMine ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-md ${isMine ? "flex-row-reverse space-x-reverse" : ""
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
                          className={`rounded-2xl ${message.isImage
                              ? "p-1"
                              : isMine
                                ? "px-4 py-2 bg-blue-500 text-white rounded-br-none"
                                : "px-4 py-2 bg-white text-gray-800 rounded-bl-none shadow-sm"
                            }`}
                        >
                          {message.isImage ? (
                            <a href={message.content} target="_blank" rel="noopener noreferrer">
                              <img
                                src={message.content}
                                alt="Shared image"
                                className="rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                                style={{
                                  width: "240px",
                                  height: "180px",
                                  objectFit: "cover",
                                }}
                              />
                            </a>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                        <p
                          className={`text-xs text-gray-500 mt-1 ${isMine ? "text-right" : "text-left"
                            }`}
                        >
                          {messageTime || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-3 relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-32 rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={clearImagePreview}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className="flex items-end space-x-3">
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* Image picker button */}
                <button
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploading}
                  className="p-2 text-gray-500 hover:text-blue-500 transition-colors disabled:opacity-50"
                  title="Send image"
                >
                  <ImageIcon size={20} />
                </button>

                <div className="flex-1 bg-gray-100 rounded-3xl px-4 py-2 flex items-center">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={imageFile ? "Add a caption (optional)..." : "Enter message..."}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
                    disabled={!wsConnected || uploading}
                  />
                  <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                    <Smile size={20} />
                  </button>
                </div>

                {/* Send button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!wsConnected || uploading || (!inputText.trim() && !imageFile)}
                  className={`p-3 rounded-full transition-colors shadow-md ${wsConnected && !uploading && (inputText.trim() || imageFile)
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  {uploading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
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
                Your messages
              </h2>
              <p className="text-gray-600">
                Choose a conversation from the left to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
