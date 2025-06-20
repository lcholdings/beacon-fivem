import { SocketPlayersPositions} from "@beacon-oss/types";
import { APIURL } from "../utils";
import { ApiResponse } from '../../types/apiResponse';
import { BeaconLogDebug } from "@common/logging";

export async function postPlayersPositions(players: SocketPlayersPositions): Promise<ApiResponse> {
  BeaconLogDebug(`postPlayersPositions: Sending ${JSON.stringify({
    players: players
  })}`);

  const postPlayersPositionsRequest = await fetch(`${APIURL}/fivem/playerpositions/123`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      players: players
    })
  })

  BeaconLogDebug(`API "playerspositions" response: ${postPlayersPositionsRequest.status} - ${postPlayersPositionsRequest.statusText}`);

  const contentType = postPlayersPositionsRequest.headers.get('content-type');
  let response: ApiResponse;

  if (contentType && contentType.includes('application/json')) {
    response = await postPlayersPositionsRequest.json() as ApiResponse;
  } else {
    const text = await postPlayersPositionsRequest.text();
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
