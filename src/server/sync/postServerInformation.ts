import type { SocketData} from "@beacon-oss/types";
import { APIURL } from "../utils";
import type { ApiResponse } from '../../types/apiResponse';
import { BeaconLogDebug } from "@common/logging";

export async function postServerInformation( socketdata: SocketData): Promise<ApiResponse> {
  BeaconLogDebug(`postServerInformation: Sending ${JSON.stringify({
    socketdata
  })}`);

  const postServerInformationRequest = await fetch(`${APIURL}/fivem/serverinformation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      socketdata
    })
  })

  BeaconLogDebug(`API "Server Information" response: ${postServerInformationRequest.status} - ${postServerInformationRequest.statusText}`);

  const contentType = postServerInformationRequest.headers.get('content-type');
  let response: ApiResponse;

  if (contentType?.includes('application/json')) {
    response = await postServerInformationRequest.json() as ApiResponse;
  } else {
    const text = await postServerInformationRequest.text();
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
