// Types
import type { ServerSocket, SocketData, SocketPlayer, SocketPlayersPositions } from '@beacon-oss/types';
import { BeaconLogDebug } from '../../common/logging';

// Init ServerPlayers Cache
var serverPlayersCache: SocketPlayer[] = [];

var serverPlayersPositionCache: SocketPlayersPositions = {};

// Init ServerSocket Cache
var serverDataCache: SocketData = {
  totalPlayers: 0,
  maxPlayers: 0,
  serverDescription: "",
  serverName: "",
  tags: "",
  serverInformation: {
    status: "offline",
    artifactVersion: "unknown",
    artifactOs: "unknown",
    resourceCount: 0,
    txAdminVersion: "unknown",
    onesyncEnabled: "false",
    enforceGameBuild: "false",
    pureLevel: "0"
  },
}

//! Get Exports
export function getServerSocketCache(): ServerSocket {
  return {
    ...serverDataCache,
    players: [...serverPlayersCache]
  };
}

export function getServerPlayersCache(): SocketPlayer[] {
  return [...serverPlayersCache];
}

export function getServerDataCache(): SocketData {
  return { ...serverDataCache };
}

export function getServerPlayersPositionCache(): SocketPlayersPositions {
  return serverPlayersPositionCache;
}
//! Set Exports
export function playerJoinedLogCache(playerData: SocketPlayer): void {
  serverDataCache.totalPlayers += 1;
  serverPlayersCache.push(playerData);
}

export function playerLeftLogCache(playerId: string): void {
  serverDataCache.totalPlayers -= 1;
  serverPlayersCache = serverPlayersCache.filter(player => player.id !== playerId);
}

export function setServerDataCache(data: Partial<SocketData>): void {
  serverDataCache = {
    ...serverDataCache,
    ...data,
    serverInformation: {
      ...serverDataCache.serverInformation,
      ...data.serverInformation
    }
  };
}

export function setServerPlayersCache(players: SocketPlayer[]): void {
  serverPlayersCache = players;
  serverDataCache.totalPlayers = players.length;
}

export function setServerPlayersPositionCache(positions: SocketPlayersPositions): void {
  serverPlayersPositionCache = positions;
}

//! Other Exports
export function clearCache(): void {
  serverPlayersCache = [];
  serverDataCache = {
    totalPlayers: 0,
    maxPlayers: 0,
    serverDescription: "",
    serverName: "",
    tags: "",
    serverInformation: {
      status: "offline",
      artifactVersion: "unknown",
      artifactOs: "unknown",
      resourceCount: 0,
      txAdminVersion: "unknown",
      onesyncEnabled: "false",
      enforceGameBuild: "false",
      pureLevel: "0"
    },
  }
}

export function printCache(): void {
  BeaconLogDebug("Server Cache Data: \n " + JSON.stringify(serverDataCache, null, 2));
  BeaconLogDebug("Server Players Cache: \n " + JSON.stringify(serverPlayersCache, null, 2));
}
