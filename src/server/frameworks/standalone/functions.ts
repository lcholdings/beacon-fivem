import type { SocketPlayer } from '@beacon-oss/types';
import type { PlayerJob } from '../../../types/playerData';

//! Return empty functions for standalone mode since they are optional

type playerDataSocket = {
  job: SocketPlayer["job"];
  name: SocketPlayer["name"];
};

export async function getStandalonePlayerDataSocket(): Promise<playerDataSocket> {
  return {
    job: null,
    name: null
  };
}

export async function getStandalonePlayerJob(): Promise<PlayerJob> {
  return {
    name: null,
    grade: null
  }
}

export async function getStandalonePlayerName(): Promise<string> {
  return null;
}
