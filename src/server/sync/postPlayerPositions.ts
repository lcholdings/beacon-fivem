import type { SocketPlayersPositions } from "@beacon-oss/types";
import { BeaconLogDebug } from "@common/logging";
import { sendSocketMessage } from "../socket";

export async function postPlayersPositions(players: SocketPlayersPositions): Promise<boolean> {
  BeaconLogDebug(`postPlayersPositions: Sending ${JSON.stringify({
    players: players
  })}`);

  const sendPlayerPositions = await sendSocketMessage({
    event: "PlayerPositionsUpdate",
    data: JSON.stringify({
      players: players
    })
  });

  BeaconLogDebug(`API "playerspositions" response: ${sendPlayerPositions}`);

  return sendPlayerPositions;
}
