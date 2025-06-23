import type { SocketPlayer } from "@beacon-oss/types";

export type PlayerJob = SocketPlayer['job'];

export type PlayerNameJob = {
  job: SocketPlayer["job"];
  name: SocketPlayer["name"];
};
