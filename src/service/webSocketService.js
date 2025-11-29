class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.socket = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.messageHandlers = new Map();
  }

  /**
   * Connect to WebSocket server
   * @param {string} url - WebSocket server URL
   * @param {function} onConnected - Callback when connected
   * @param {function} onError - Callback on error
   */
  connect(url, onConnected, onError) {
    if (this.connected) {
      console.log("Already connected to WebSocket");
      return;
    }

    try {
      // Create WebSocket connection
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log("✅ WebSocket connected");
        this.connected = true;
        this.reconnectAttempts = 0;
        
        // Send CONNECT frame
        this.sendFrame("CONNECT", {
          "accept-version": "1.2",
          "heart-beat": "10000,10000"
        });
      };

      this.socket.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.socket.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        if (onError) onError(error);
      };

      this.socket.onclose = () => {
        console.log("🔴 WebSocket disconnected");
        this.connected = false;
        this.handleReconnect(url, onConnected, onError);
      };

      this.onConnectedCallback = onConnected;
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      if (onError) onError(error);
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleMessage(data) {
    const lines = data.split("\n");
    const command = lines[0];

    if (command === "CONNECTED") {
      console.log("✅ STOMP connected");
      if (this.onConnectedCallback) {
        this.onConnectedCallback();
      }
    } else if (command === "MESSAGE") {
      // Parse MESSAGE frame
      let destination = null;
      let body = null;
      let inBody = false;

      for (let i = 1; i < lines.length; i++) {
        if (lines[i] === "") {
          inBody = true;
          continue;
        }

        if (!inBody) {
          if (lines[i].startsWith("destination:")) {
            destination = lines[i].substring("destination:".length);
          }
        } else {
          body = lines.slice(i).join("\n").replace(/\0$/, "");
          break;
        }
      }

      if (destination && body) {
        try {
          const message = JSON.parse(body);
          this.notifySubscribers(destination, message);
        } catch (e) {
          console.error("Failed to parse message:", e);
        }
      }
    }
  }

  /**
   * Send STOMP frame
   */
  sendFrame(command, headers = {}, body = "") {
if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    let frame = command + "\n";
    
    for (const [key, value] of Object.entries(headers)) {
      frame += `${key}:${value}\n`;
    }
    
    frame += "\n" + body + "\0";
    
    this.socket.send(frame);
  }

  /**
   * Subscribe to a destination
   * @param {string} destination - Destination to subscribe to (e.g., "/queue/private/123")
   * @param {function} callback - Callback function to handle messages
   * @returns {string} Subscription ID
   */
  subscribe(destination, callback) {
    if (!this.connected) {
      console.error("Cannot subscribe: WebSocket not connected");
      return null;
    }

    const subscriptionId = `sub-${Date.now()}-${Math.random()}`;
    
    this.sendFrame("SUBSCRIBE", {
      id: subscriptionId,
      destination: destination
    });

    this.subscriptions.set(subscriptionId, { destination, callback });
    console.log(`📥 Subscribed to ${destination} with ID: ${subscriptionId}`);

    return subscriptionId;
  }

  /**
   * Unsubscribe from a destination
   */
  unsubscribe(subscriptionId) {
    if (!subscriptionId) return;

    this.sendFrame("UNSUBSCRIBE", {
      id: subscriptionId
    });

    this.subscriptions.delete(subscriptionId);
    console.log(`🔴 Unsubscribed: ${subscriptionId}`);
  }

  /**
   * Notify all subscribers of a destination
   */
  notifySubscribers(destination, message) {
    for (const [id, subscription] of this.subscriptions) {
      if (subscription.destination === destination) {
        subscription.callback(message);
      }
    }
  }

  /**
   * Send a message to a destination
   */
  send(destination, body) {
    if (!this.connected) {
      console.error("Cannot send: WebSocket not connected");
      return;
    }

    this.sendFrame("SEND", {
      destination: destination,
      "content-type": "application/json"
    }, JSON.stringify(body));
  }

  /**
   * Handle reconnection
   */
  handleReconnect(url, onConnected, onError) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );

      setTimeout(() => {
        this.connect(url, onConnected, onError);
      }, this.reconnectDelay);
    } else {
      console.error("❌ Max reconnection attempts reached");
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.socket) {
      // Unsubscribe all
      for (const [id] of this.subscriptions) {
        this.unsubscribe(id);
      }

      // Send DISCONNECT frame
      this.sendFrame("DISCONNECT", {});

      // Close socket
      this.socket.close();
      this.socket = null;
      this.connected = false;
      this.subscriptions.clear();
      console.log("🔴 Disconnected from WebSocket");
    }
  }

  /**
   * Check if connected
   */
isConnected() {
    return this.connected;
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
