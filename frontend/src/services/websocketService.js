import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { WS_URL, WS_TOPICS, WS_DESTINATIONS } from "../utils/constants";

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.connectionCallbacks = {
      onConnect: null,
      onDisconnect: null,
      onError: null,
    };
  }

  /**
   * Connects to the WebSocket server
   * @param {string} token - JWT authentication token
   * @param {Function} onConnect - Callback when connected
   * @param {Function} onError - Callback on error
   * @param {Function} onDisconnect - Callback when disconnected
   */
  connect(token, onConnect, onError, onDisconnect) {
    if (this.isConnected && this.client?.connected) {
      console.log("WebSocket already connected");
      if (onConnect) onConnect();
      return;
    }

    this.connectionCallbacks = { onConnect, onDisconnect, onError };

    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log("STOMP:", str);
        }
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        console.log("WebSocket connected");
        if (onConnect) onConnect();
      },
      onDisconnect: () => {
        this.isConnected = false;
        console.log("WebSocket disconnected");
        if (onDisconnect) onDisconnect();
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
        console.error("Details:", frame.body);
        if (onError) onError(new Error(frame.headers["message"]));
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error:", event);
        if (onError) onError(event);
      },
      onWebSocketClose: () => {
        this.isConnected = false;
        this.handleReconnect();
      },
    });

    this.client.activate();
  }

  /**
   * Handles reconnection logic
   */
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
      );
      setTimeout(() => {
        if (!this.isConnected && this.client) {
          this.client.activate();
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error("Max reconnection attempts reached");
      if (this.connectionCallbacks.onError) {
        this.connectionCallbacks.onError(
          new Error("Connection lost. Please refresh the page.")
        );
      }
    }
  }

  /**
   * Disconnects from the WebSocket server
   */
  disconnect() {
    if (this.client) {
      // Unsubscribe from all subscriptions
      this.subscriptions.forEach((sub) => {
        try {
          sub.unsubscribe();
        } catch {
          // Ignore unsubscribe errors
        }
      });
      this.subscriptions.clear();

      this.client.deactivate();
      this.isConnected = false;
      console.log("WebSocket disconnected intentionally");
    }
  }

  /**
   * Subscribes to document edit updates
   * @param {string|number} documentId - Document ID
   * @param {Function} callback - Message handler callback
   * @returns {Object} Subscription object
   */
  subscribeToDocumentUpdates(documentId, callback) {
    return this.subscribe(
      WS_TOPICS.DOCUMENT_UPDATES(documentId),
      `updates-${documentId}`,
      callback
    );
  }

  /**
   * Subscribes to cursor position updates
   * @param {string|number} documentId - Document ID
   * @param {Function} callback - Message handler callback
   * @returns {Object} Subscription object
   */
  subscribeToCursorUpdates(documentId, callback) {
    return this.subscribe(
      WS_TOPICS.DOCUMENT_CURSORS(documentId),
      `cursors-${documentId}`,
      callback
    );
  }

  /**
   * Subscribes to user presence updates
   * @param {string|number} documentId - Document ID
   * @param {Function} callback - Message handler callback
   * @returns {Object} Subscription object
   */
  subscribeToPresence(documentId, callback) {
    return this.subscribe(
      WS_TOPICS.DOCUMENT_PRESENCE(documentId),
      `presence-${documentId}`,
      callback
    );
  }

  /**
   * Generic subscription method
   * @param {string} topic - Topic to subscribe to
   * @param {string} key - Subscription key for management
   * @param {Function} callback - Message handler
   * @returns {Object} Subscription object
   */
  subscribe(topic, key, callback) {
    if (!this.client || !this.isConnected) {
      console.warn("Cannot subscribe: WebSocket not connected");
      return null;
    }

    // Unsubscribe from existing subscription with same key
    if (this.subscriptions.has(key)) {
      this.subscriptions.get(key).unsubscribe();
    }

    const subscription = this.client.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        callback(message.body);
      }
    });

    this.subscriptions.set(key, subscription);
    return subscription;
  }

  /**
   * Unsubscribes from a specific topic
   * @param {string} key - Subscription key
   */
  unsubscribe(key) {
    if (this.subscriptions.has(key)) {
      this.subscriptions.get(key).unsubscribe();
      this.subscriptions.delete(key);
    }
  }

  /**
   * Unsubscribes from all document-related subscriptions
   * @param {string|number} documentId - Document ID
   */
  unsubscribeFromDocument(documentId) {
    this.unsubscribe(`updates-${documentId}`);
    this.unsubscribe(`cursors-${documentId}`);
    this.unsubscribe(`presence-${documentId}`);
  }

  /**
   * Sends a document edit message
   * @param {string|number} documentId - Document ID
   * @param {Object} editMessage - Edit message payload
   */
  sendEdit(documentId, editMessage) {
    this.send(WS_DESTINATIONS.DOCUMENT_EDIT(documentId), editMessage);
  }

  /**
   * Sends a cursor position update
   * @param {string|number} documentId - Document ID
   * @param {Object} cursorMessage - Cursor position payload
   */
  sendCursorPosition(documentId, cursorMessage) {
    this.send(WS_DESTINATIONS.DOCUMENT_CURSOR(documentId), cursorMessage);
  }

  /**
   * Sends a presence update (join/leave)
   * @param {string|number} documentId - Document ID
   * @param {Object} presenceMessage - Presence payload
   */
  sendPresence(documentId, presenceMessage) {
    this.send(WS_DESTINATIONS.DOCUMENT_PRESENCE(documentId), presenceMessage);
  }

  /**
   * Generic send method
   * @param {string} destination - STOMP destination
   * @param {Object} message - Message payload
   */
  send(destination, message) {
    if (!this.client || !this.isConnected) {
      console.warn("Cannot send: WebSocket not connected");
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(message),
    });
  }

  /**
   * Gets the current connection status
   * @returns {boolean} True if connected
   */
  getConnectionStatus() {
    return this.isConnected && this.client?.connected;
  }
}

// Export singleton instance
const websocketService = new WebSocketService();
export default websocketService;
