// OX Lib
import { addCommand } from "@communityox/ox_lib/server";

// Cache
import { clearCache, printCache } from "./cache";

// Logging
import { BeaconLogDebug } from "@common/logging";

// Functions
import { fetchServerSocketData } from "./index";

// Configuration
import Config from '@common/config';


export function registerCommands() {
  // !! Debug Commands
  // Print Cache
  if (Config.Debug.Commands.PrintCache) {
    addCommand('printCache', async (source, args, raw) => {
      printCache();
      BeaconLogDebug("Server socket cache printed to server console.");
    }, {
      restricted: 'group.admin',
      help: 'Prints the current server socket cache to the server console.'
    });
  }

  // Clear Cache
  if (Config.Debug.Commands.ClearCache) {
    addCommand('clearCache', async (source, args, raw) => {
      clearCache();
      fetchServerSocketData();
      BeaconLogDebug("Server socket cache cleared and refetched.");
    }, {
      restricted: 'group.admin',
      help: 'Clears the server socket cache and refetches completely.'
    });
  }
}
