import React, { useEffect, useState, useRef } from "react";
import { chatService } from "../../service/chatService";
import { webSocketService } from "../../service/webSocketService";
import { authService } from "../../service/authService";

const Chat2 = () => {
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState([]);
    const [wsConnected, setWsConnected] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const subscriptionRef = useRef(null);
    const messagesEndRef = useRef(null);

    const FIXED_USER_ID = 8; // Chat với user ID 8

    // Get current user ID from backend profile
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const profile = await authService.getProfile();
                if (profile && profile.id) {
                    setCurrentUserId(profile.id);
                    console.log("Current user ID:", profile.id);
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
            console.log("[Chat2] No currentUserId yet, skip WebSocket connect");
            return;
        }

        // Build WebSocket URL from API base URL
        const apiUrl = import.meta.env.VITE_API_URL;
        const wsUrl = apiUrl.replace(/^http/, "ws") + "ws";
        console.log("[Chat2] Connecting WebSocket to:", wsUrl, "for user:", currentUserId);

        webSocketService.connect(
            wsUrl,
            () => {
                console.log("✅ Connected to WebSocket (Chat2.jsx)");
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
                console.error("❌ WebSocket connection error (Chat2.jsx):", error);
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
        console.log("Processing incoming message:", message);

        // Check if message is for the conversation with user ID 8
        if (
            message.senderId === FIXED_USER_ID ||
            message.receiverId === FIXED_USER_ID
        ) {
            setMessages((prevMessages) => {
                // Check if message already exists
                const exists = prevMessages.some((msg) => {
                    if (msg.id && message.id) {
                        return msg.id === message.id;
                    }
                    return (
                        msg.content === message.content &&
                        msg.senderId === message.senderId &&
                        Math.abs(new Date(msg.createdAt) - new Date(message.timestamp || message.createdAt)) < 1000
                    );
                });

                if (exists) {
                    console.log("Message already exists, skipping");
                    return prevMessages;
                }

                console.log("Adding new message to list");
                return [...prevMessages, {
                    id: message.id,
                    senderId: message.senderId,
                    senderName: message.senderName,
                    senderAvatarUrl: message.senderAvatarUrl,
                    receiverId: message.receiverId,
                    receiverName: message.receiverName,
                    receiverAvatarUrl: message.receiverAvatarUrl,
                    content: message.content,
                    createdAt: message.timestamp || message.createdAt,
                    updatedAt: message.updatedAt
                }];
            });
        }
    };

    // Scroll to bottom when new message arrives
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load messages with user ID 8
    const loadMessages = async () => {
        try {
            const response = await chatService.getMessagesByUserId(FIXED_USER_ID, 1, 50);
            console.log("Messages with user 8:", response.content);
            setMessages(response.content.reverse());
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        if (currentUserId) {
            loadMessages();
        }
    }, [currentUserId]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const messageContent = inputText.trim();
        setInputText(""); // Clear input immediately

        try {
            const data = {
                receiverId: FIXED_USER_ID,
                content: messageContent,
            };

            // Step 1: Send via REST API to save in database
            const response = await chatService.sendMessage(data);
            console.log("Message saved to database:", response);

            // Step 2: Send via WebSocket for realtime delivery
            if (wsConnected) {
                const wsMessage = {
                    senderId: currentUserId,
                    senderName: response.senderName,
                    senderAvatarUrl: response.senderAvatarUrl,
                    receiverId: FIXED_USER_ID,
                    receiverName: "User 8",
                    receiverAvatarUrl: "",
                    content: messageContent,
                    timestamp: new Date().toISOString(),
                    id: response.id
                };

                webSocketService.send("/app/chat.private", wsMessage);
                console.log("Message sent via WebSocket:", wsMessage);
            }
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

        // Parse the time string as UTC and convert to Vietnam time
        const date = new Date(timeString);

        // Add 'Z' if the string doesn't have timezone info to force UTC parsing
        const utcDate = timeString.endsWith('Z') ? date : new Date(timeString + 'Z');

        return utcDate.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Ho_Chi_Minh",
        });
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1>Chat Test - User ID 8</h1>

            {/* Connection Status */}
            <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: wsConnected ? "#d4edda" : "#f8d7da", border: "1px solid", borderColor: wsConnected ? "#c3e6cb" : "#f5c6cb", borderRadius: "5px" }}>
                <strong>WebSocket Status:</strong> {wsConnected ? "✅ Connected" : "❌ Disconnected"}
                <br />
                <strong>Current User ID:</strong> {currentUserId || "Loading..."}
                <br />
                <strong>Chatting with User ID:</strong> {FIXED_USER_ID}
            </div>

            {/* Messages Area */}
            <div style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "15px", height: "400px", overflowY: "auto", marginBottom: "20px", backgroundColor: "#f9f9f9" }}>
                {messages.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#999" }}>No messages yet. Start chatting!</p>
                ) : (
                    messages.map((message, index) => {
                        const isMine = isMyMessage(message);
                        const messageTime = formatTime(message.createdAt);

                        return (
                            <div
                                key={message.id || `msg-${index}`}
                                style={{
                                    marginBottom: "15px",
                                    display: "flex",
                                    justifyContent: isMine ? "flex-end" : "flex-start"
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: "70%",
                                        padding: "10px 15px",
                                        borderRadius: "10px",
                                        backgroundColor: isMine ? "#007bff" : "#e9ecef",
                                        color: isMine ? "white" : "black"
                                    }}
                                >
                                    <div style={{ fontSize: "12px", marginBottom: "5px", opacity: 0.8 }}>
                                        {isMine ? "You" : `User ${message.senderId}`}
                                    </div>
                                    <div>{message.content}</div>
                                    <div style={{ fontSize: "10px", marginTop: "5px", opacity: 0.7 }}>
                                        {messageTime}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ display: "flex", gap: "10px" }}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={!wsConnected}
                    style={{
                        flex: 1,
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        fontSize: "14px"
                    }}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!wsConnected || !inputText.trim()}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: wsConnected && inputText.trim() ? "#007bff" : "#ccc",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: wsConnected && inputText.trim() ? "pointer" : "not-allowed",
                        fontSize: "14px"
                    }}
                >
                    Send
                </button>
            </div>

            {/* Debug Info */}
            <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px", fontSize: "12px" }}>
                <strong>Debug Info:</strong>
                <br />
                Total Messages: {messages.length}
                <br />
                Last Message: {messages.length > 0 ? messages[messages.length - 1].content : "N/A"}
            </div>
        </div>
    );
};

export default Chat2;
