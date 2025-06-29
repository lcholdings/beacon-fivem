import { versionCheck } from '@communityox/ox_lib/server';
import { getInitialServerData, getInitialServerSocketPlayers, getInitialServerSocketPlayersPositions } from './socketData';
import { getErrorTimeout, getIsAuthenticated, setErrorTimeout, setServerDataCache, setServerPlayersCache, setServerPlayersPositionCache } from './cache';
import { InitLog } from './init';
import { registerCommands } from './commands';
import { socketConnection } from './socket';
import { postPlayers } from './sync/postPlayers';
import { postPlayersPositions } from './sync/postPlayerPositions';
import { BeaconLog, BeaconLogDebug } from '@common/logging';
import { postServerInformation } from './sync/postServerInformation';
import { checkAuthorization } from './authorization';

//! Version Check
versionCheck("lcholdings/beacon-fivem")

//! Initial Log
InitLog()

async function authorizationAwait() {
  //! Check Authorization
  const authorize = await checkAuthorization();

  if (authorize) {
    //! Socket Connection
    socketConnection();
  }
}

authorizationAwait()

//! Server Socket
export async function fetchServerSocketData() {
  if (!getIsAuthenticated()) return
  if (getErrorTimeout() && new Date().getTime() - getErrorTimeout().getTime() < 1000 * 60 * 5) return

  try {
    const serverData = await getInitialServerData();
    const serverPlayers = await getInitialServerSocketPlayers();
    setServerDataCache(serverData);
    setServerPlayersCache(serverPlayers);

    try {
      const doPostPlayers = await postPlayers(serverPlayers)
      const doServerInformation = await postServerInformation(serverData)

      if (!doPostPlayers) {
        BeaconLog("An unexpected error has occured while fetching all players. Please contact support if the problem persists. More information can be found in the debug logs.", "error")
        throw new Error("Error fetching all players")
      }
      if (!doServerInformation) {
        BeaconLog("An unexpected error has occured while fetching server information. Please contact support if the problem persists. More information can be found in the debug logs.", "error")
        throw new Error("Error fetching server information")
      }
    } catch (error) {
      setErrorTimeout()
      BeaconLog("An unexpected error has occured. Please contact support if the problem persists.", "error")
      BeaconLogDebug(error)
    }

    return true;
  } catch (error) {
    setErrorTimeout()
    throw new Error('Error fetching server socket data:', error);
  }
}

export async function fetchServerSocketPlayerPositons() {
  if (!getIsAuthenticated()) return
  if (getErrorTimeout() && new Date().getTime() - getErrorTimeout().getTime() < 1000 * 60 * 5) return
  try {
    const playerpositons = await getInitialServerSocketPlayersPositions();

    setServerPlayersPositionCache(playerpositons);

    try {
      const doPostPlayersPositions = await postPlayersPositions(playerpositons)

      if (!doPostPlayersPositions) {
        BeaconLog("An unexpected error has occured while fetching all players positions. Please contact support if the problem persists. More information can be found in the debug logs.", "error")
      }
    } catch (error) {
      setErrorTimeout()
      BeaconLog("An unexpected error has occured. Please contact support if the problem persists.", "error")
      BeaconLogDebug(error)
    }
    return true;
  } catch (error) {
    setErrorTimeout()
    throw new Error('Error fetching server socket player positions:', error);
  }
}

// ! Timeout to allow callbacks to be registered
// ? Temporary
setInterval(() => {
  if (!getIsAuthenticated()) return
  fetchServerSocketPlayerPositons()
  fetchServerSocketData()
}, 5000);

//! Commands
registerCommands()
