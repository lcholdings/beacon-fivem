import type { SocketData } from "@beacon-oss/types";
import { BeaconLogDebug } from "@common/logging";
import { sendSocketMessage } from "../socket";

export async function postServerInformation(socketData: SocketData): Promise<boolean> {
  BeaconLogDebug(`postServerInformation: Sending ${JSON.stringify(socketData)}`);

  const sendPlayersMessage = await sendSocketMessage({
    event: "server-information-update",
    data: socketData
  });

  BeaconLogDebug(`WebSocket "postServerInformation": ${sendPlayersMessage}`);

  return sendPlayersMessage;
}
