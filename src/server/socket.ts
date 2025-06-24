
import { BeaconLog, BeaconLogDebug } from "@common/logging";
import { WebSocketURL } from "./utils";
import { getIsAuthenticated } from "./cache";

let socket: WebSocket;

async function processSocketMessage(data: string) {
  try {
    const message = JSON.parse(data);
    BeaconLogDebug(`WebSocket message processed: ${JSON.stringify(message)}`);
    // Handle the message as needed
  } catch (error) {
    BeaconLog(`Failed to process WebSocket message: ${error.message}`, "error");
  }
}

export async function socketConnection() {
  try {
    if (!getIsAuthenticated()) return false;

    socket = new WebSocket(`${WebSocketURL}/ws/mainstream`);

    socket.onopen = () => {
      BeaconLog("Socket connection API has been opened.", "info");
    };

    socket.onerror = (error) => {
      BeaconLog(`WebSocket connection failed: ${JSON.stringify(error.message)}`, "error");
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        BeaconLogDebug("WebSocket connection closed cleanly.");
      } else {
        BeaconLog(`WebSocket connection closed unexpectedly: ${event.code} ${event.reason}`, "error");
      }
    };

    socket.onmessage = (event) => {
      processSocketMessage(event.data);
    };
  } catch (error) {
    console.error("Authorization check failed:", error);
    return false
  }
}
