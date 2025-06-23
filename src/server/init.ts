import { availableLocales } from 'locale';
import { ResourceMetadata } from '@common/resource';
import { BeaconLog, BeaconLogDebug } from '@common/logging';
import Config from '@common/config';

export type ServerFrameworks = "qbox" | "standalone"
export const allowedFrameworks: ServerFrameworks[] = ["qbox", "standalone"];

const AsciiArt = `
 ______    _______     ___       ______   ______    __   __
|   _  \\  |   ____|   /   \\     /      | /  __  \\  |  \\ |  |
|  |_)  | |  |__     /  ^  \\   |  ,----'|  |  |  | |   \\|  |
|   _  <  |   __|   /  /_\\  \\  |  |     |  |  |  | |  . \`  |
|  |_)  | |  |____ /  _____  \\ |  \`----.|  \`--'  | |  |\\   |
|______/  |_______/__/     \\__\\ \\______| \\______/  |__| \\__|
`

export function InitLog() {
  // Log the ASCII art
  AsciiArt.split('\n').forEach(row => {
    if (row.trim() !== '') {
      console.log(`^4${row}`);
    }
  });

  // Blank row for spacing
  console.log('');

  // Log Version
  BeaconLog(`You are running version ^4${ResourceMetadata.version}`, "info");
  if (ResourceMetadata.version.includes("-")) {
    BeaconLog("This is a development version, not recommended for production use.", "warn");
  }

  // Locale Check and encourage translation
  BeaconLog('Help us translate Beacon! Contribute new locales at https://github.com/lcholdings/beacon-fivem', 'info');
  if (GetConvar("ox:locale", "none") === "none") {
    BeaconLog(`Please set a locale using "setr ox:locale <locale>" in your cfg. Available Locales: ${availableLocales.map(locale => locale.toUpperCase())}.`, "warn");
  } else if (!availableLocales.includes(GetConvar("ox:locale", "none").toLowerCase())) {
    BeaconLog(`"${GetConvar("ox:locale", "none").toUpperCase()}" locale not supported, using english.`, "warn");
  }

  // Framework Check
  if (
    typeof Config.ServerFramework === "string" &&
    allowedFrameworks.includes(Config.ServerFramework as ServerFrameworks)
  ) {
    BeaconLog(`Server Framework: ^4${Config.ServerFramework.toUpperCase()}`, "info");
    if (Config.ServerFramework === "standalone") {
      BeaconLog("For help getting your framework setup, please open a ticket at https://discord.gg/hze4CTJW5z!", "info");
    }
  } else {
    BeaconLog(`Invalid Server Framework: ${Config.ServerFramework}`, "error");
  }

  // Debug Mode
  if (
    Config.Debug.Commands.ClearCache ||
    Config.Debug.Commands.PrintCache ||
    Config.Debug.DebugLogs
  ) {
    const enabledDebug = []
    if (Config.Debug.Commands.ClearCache) {
      enabledDebug.push("Debug.Commands.ClearCache");
    }
    if (Config.Debug.Commands.PrintCache) {
      enabledDebug.push("Debug.Commands.PrintCache");
    }
    if (Config.Debug.DebugLogs) {
      enabledDebug.push("Debug.DebugLogs");
    }
    BeaconLogDebug(`Debug Mode Enabled: ^4${enabledDebug.join(", ")}`);
  }
}


