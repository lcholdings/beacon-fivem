import { SocketPlayer } from "@beacon-oss/types";
import { APIURL } from "../utils";
import { ApiResponse } from '../../types/apiResponse';
import { BeaconLogDebug } from "@common/logging";

export async function postPlayers(players: SocketPlayer[]): Promise<ApiResponse> {
  BeaconLogDebug(`postPlayers: Sending ${JSON.stringify({
    players: players
  })}`);

  const postPlayersRequest = await fetch(`${APIURL}/fivem/playersupdate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      players: players
    })
  })

  BeaconLogDebug(`API "playersupdate" response: ${postPlayersRequest.status} - ${postPlayersRequest.statusText}`);

  const contentType = postPlayersRequest.headers.get('content-type');
  let response: ApiResponse;

  if (contentType && contentType.includes('application/json')) {
    response = await postPlayersRequest.json() as ApiResponse;
  } else {
    const text = await postPlayersRequest.text();
    response = {
      message: text,
      error: "Non-JSON response"
    };
  }

  if (!response.message) {
    return {
      message: "An unexpected error has occured. Please contact support if the problem persists.",
      error: "Internal Server Error"
    }
  }

  return response;
}
