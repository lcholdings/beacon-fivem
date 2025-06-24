import type { SocketPlayer } from "@beacon-oss/types";
import { BeaconLogDebug } from "@common/logging";
import { sendSocketMessage } from "../socket";

export async function postPlayers(players: SocketPlayer[]): Promise<boolean> {
  BeaconLogDebug(`postPlayers: Sending ${JSON.stringify(players)}`);

  const sendPlayersMessage = await sendSocketMessage({
    event: "players-update",
    data: players
  });

  BeaconLogDebug(`WebSocket "postPlayers": ${sendPlayersMessage}`);

  return sendPlayersMessage;
}
