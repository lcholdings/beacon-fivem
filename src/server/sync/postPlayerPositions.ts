import type { SocketPlayersPositions } from "@beacon-oss/types";
import { BeaconLogDebug } from "@common/logging";
import { sendSocketMessage } from "../socket";

export async function postPlayersPositions(players: SocketPlayersPositions): Promise<boolean> {
  BeaconLogDebug(`postPlayersPositions: Sending ${JSON.stringify(players)}`);

  const sendPlayerPositions = await sendSocketMessage({
    event: "player-positions-update",
    data: players
  });

  BeaconLogDebug(`API "playerspositions" response: ${sendPlayerPositions}`);

  return sendPlayerPositions;
}
