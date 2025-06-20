import { versionCheck } from '@communityox/ox_lib/server';
import { getInitialServerData, getInitialServerSocketPlayers, getInitialServerSocketPlayersPositions } from './socketData';
import { setServerDataCache, setServerPlayersCache, setServerPlayersPositionCache } from './cache';
import { InitLog } from './init';
import { registerCommands } from './commands';
import { socketConnection } from './socket';
import { postPlayers } from './sync/postPlayers';
import { postPlayersPositions } from './sync/postPlayerPositions';
import { BeaconLog, BeaconLogDebug } from '@common/logging';
//! Version Check
versionCheck("lcholdings/beacon-fivem")

//! Initial Log
InitLog()

//! socket connection
socketConnection()

//! Server Socket
export async function fetchServerSocketData() {
  try {
    const serverData = await getInitialServerData();
    console.log("Server Data: ", serverData)
    const serverPlayers = await getInitialServerSocketPlayers();
    console.log("Server Players: ", serverPlayers)
    setServerDataCache(serverData);
    setServerPlayersCache(serverPlayers);

    try {
      const doPostPlayers = await postPlayers(serverPlayers)

      if (doPostPlayers.error) {
        BeaconLog("An unexpected error has occured while fetching all players. Please contact support if the problem persists. More information can be found in the debug logs.", "error")
      }

      BeaconLogDebug(doPostPlayers.error + ": " + doPostPlayers.message)
    } catch (error) {
      BeaconLog("An unexpected error has occured. Please contact support if the problem persists.", "error")
      BeaconLogDebug(error)
    }

    return true;
  } catch (error) {
    throw new Error('Error fetching server socket data:', error);
  }
}
export async function fetchServerSocketPlayerPositons() {
  try {
    const playerpositons = await getInitialServerSocketPlayersPositions();

    setServerPlayersPositionCache(playerpositons);

    try {
      const doPostPlayersPositions = await postPlayersPositions(playerpositons)
      if (doPostPlayersPositions.error) {
        BeaconLog("An unexpected error has occured while fetching all players positions. Please contact support if the problem persists. More information can be found in the debug logs.", "error")
      }
      BeaconLogDebug(doPostPlayersPositions.error + ": " + doPostPlayersPositions.message)
    } catch (error) {
      BeaconLog("An unexpected error has occured. Please contact support if the problem persists.", "error")
      BeaconLogDebug(error)

    }
    return true;
  } catch (error) {
    throw new Error('Error fetching server socket player positions:', error);
  }
}

// ! Timeout to allow callbacks to be registered
setInterval(() => {
  fetchServerSocketData()
}, 1000);
setTimeout(() => {
  setInterval(() => {
    fetchServerSocketPlayerPositons()
  }, 1000);
}, 1000);

//! Commands
registerCommands()
