import Config from "./config";

type logTypeDebug = "debug" | "info" | "error" | "warn";
type logType = Exclude<logTypeDebug, "debug">;

const typeColor: Record<logTypeDebug, string> = {
  debug: '^3',
  info: '^7',
  error: '^1',
  warn: '^3',
};

function doLog(message: string, type: logTypeDebug) {
  const typeWithColor = `${typeColor[type]}[${type.toUpperCase()}]`;

  console.log(`^4[BEACON] ${typeWithColor} ${typeColor[type]}${message}`);
}

export function BeaconLogDebug(message: string) {
  if (!Config.Debug.DebugLogs) return;
  doLog(message, "debug")
}

export function BeaconLog(message: string, type: logType) {
  doLog(message, type);
}
