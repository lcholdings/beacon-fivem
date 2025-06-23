import { BeaconLog, BeaconLogDebug } from "@common/logging";
import { ResourceMetadata, } from "@common/resource";
import { APIURL, WebSocketURL } from "./utils";
import { setIsAuthenticated } from "./cache";

const headers = {
  'Content-Type': 'application/json',
  'User-Agent': `beacon-fivem/${ResourceMetadata.version} (${ResourceMetadata.context})`,
};

export async function checkAuthorization() {
  try {
    const response = await fetch(`${APIURL}/fivem/authcheck`, {
      method: "GET",
      headers: headers
    })

    BeaconLogDebug(`Authorization check response: ${response.status} ${response.statusText}`);

    if (response.status === 426) {
      BeaconLogDebug("Connection is already authorized, no further action needed.");
      return true
    }

    if (response.status === 401) {
      const responseBody = await response.json() as { ip: string, error: string };

      const connectionCode = Buffer.from(JSON.stringify({
        ipAddress: responseBody.ip,
        clientName: GetConvar("sv_projectName", "Unknown Client"),
      })).toString('base64');

      const connectionUrl = `https://beta.beacon5m.com/connect?code=${connectionCode}`;

      BeaconLog(`Please authorize your server at ${connectionUrl}`, "error");

      const connectSocket = new WebSocket(`${WebSocketURL}/ws/awaitconnect`, {
        headers: headers
      });

      connectSocket.onopen = () => {
        BeaconLogDebug("Socket connection for authorization confirmation has been opened.");
      };

      return new Promise((resolve) => {
        connectSocket.onmessage = (event) => {
          BeaconLogDebug(`Authorization confirmation message received: ${event.data}`);
          if (event.data === "Authorized") {
            BeaconLog("Server has been successfully authorized.", "info");
            setIsAuthenticated(true);
            resolve(true);
          }
          else if (event.data === "unauthorized") {
            BeaconLog("Server authorization failed. Please try again.", "error");
            resolve(false);
          }
        };
        connectSocket.onerror = (error) => {
          BeaconLog(`WebSocket connection for authorization failed: ${JSON.stringify(error.message)}`, "error");
          resolve(false);
        };
        connectSocket.onclose = (event) => {
          if (event.wasClean) {
            BeaconLogDebug("WebSocket connection for authorization closed cleanly.");
          }
          else {
            BeaconLog(`WebSocket connection for authorization closed unexpectedly: ${event.code} ${event.reason}`, "error");
          }
          resolve(false);
        };
      });
    }

    BeaconLog(`Couldn't connect to the Beacon API. Check https://status.beacon5m.com for more information or open a ticket on our discord server.`, "error")
    return false
  } catch {
    BeaconLog("An error occurred while checking authorization. Please ensure the Beacon API is running and accessible.", "error");
    return false;
  }
}
