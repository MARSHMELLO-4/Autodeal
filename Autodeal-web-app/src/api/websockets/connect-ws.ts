import { Client, type IMessage } from "@stomp/stompjs";

export interface InventoryWebSocketEvent {
  type: "VEHICLE_CREATED" | "VEHICLE_UPDATED" | "VEHICLE_SOLD";
  id: number;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function getWebSocketUrl() {
  const apiUrl = new URL(API_BASE_URL);
  apiUrl.protocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
  apiUrl.pathname = "/ws";
  apiUrl.search = "";
  apiUrl.hash = "";
  return apiUrl.toString();
}

export function connectInventoryWebSocket(
  onEvent: (event: InventoryWebSocketEvent) => void,
) {
  const client = new Client({
    brokerURL: getWebSocketUrl(),
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe("/topic/inventory", (message: IMessage) => {
        const event = JSON.parse(message.body) as InventoryWebSocketEvent;
        onEvent(event);
      });
    },
    onStompError: (frame) => {
      console.error("Inventory WebSocket STOMP error:", frame.headers.message);
    },
    onWebSocketError: (error) => {
      console.error("Inventory WebSocket error:", error);
    },
  });

  client.activate();

  return () => {
    void client.deactivate();
  };
}
