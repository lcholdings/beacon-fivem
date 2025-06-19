// OX Lib
import { triggerClientCallback } from "@communityox/ox_lib/server";

// Frameworks
import { getPlayerDataSocket } from "./frameworks";

// Types
import { PlayerIdentifiers, SocketData, SocketPlayer } from "@beacon-oss/types";
import { PlayerNameJob } from "../types/playerData";

// Remove prefix from identifiers
function removePrefix(identifier: string) {
  const idx = identifier.indexOf(":")
  return idx !== -1 ? identifier.slice(idx + 1) : identifier
}

// Fetch Server FXServer Info
async function fetchFXServerInfo(): Promise<{ artifactVersion: string, artifactOs: "windows" | "linux" | "unknown" }> {
  // Fetch info from server endpoint
  try {
    const fxsVersion = GetConvar('version', 'invalid')

    // Extract artifact version and OS from server string then return
    const artifactMatch = fxsVersion.match(/v([\d.]+)/);
    let artifactVersion = artifactMatch ? artifactMatch[1] : "Unknown";

    return {
      artifactVersion: artifactVersion.slice("1.0.0.".length),
      artifactOs: fxsVersion.includes("win32") ? "windows" : "linux",
    };
  } catch (error) {
    console.error("Failed to fetch server version:", error);
    return {
      artifactVersion: "unknown",
      artifactOs: "unknown"
    };
  }
}
// hur skriker den inte tog ju bort positons wher are my errors
// Get Player Identifiers Data
async function getPlayerIdentifiersData(playerId: string): Promise<PlayerIdentifiers> {
  const identifiers: string[] = getPlayerIdentifiers(playerId);

  // Format the identifiers
  const getId = (prefix: string) =>
    removePrefix(identifiers.find(id => id.startsWith(prefix + ":")) || "");

  return {
    primaryLicense: getId("license"),
    steamHex: getId("steam"),
    discordId: getId("discord"),
    fivemId: getId("fivem"),
    liveId: getId("live"),
    xboxId: getId("xbl"),
    licenses: identifiers
      .filter(id => id.startsWith("license"))
      .map(removePrefix),
    ipAddresses: [GetPlayerEndpoint(playerId)]
  };
}

// Get initial Server Data
export async function getInitialServerData(): Promise<SocketData> {
  const onlinePlayers = getPlayers();
  const serverArtifacts = await fetchFXServerInfo();

  return {
    totalPlayers: onlinePlayers.length || 0,
    maxPlayers: GetConvarInt("sv_maxclients", 64),
    locale: GetConvar("locale", ""),
    serverDescription: GetConvar("sv_projectDesc", "No description provided"),
    serverName: GetConvar("sv_projectName", "No server name provided"),
    tags: GetConvar("tags", ""),
    serverInformation: {
      status: "online",
      resourceCount: GetNumResources() || 0,
      txAdminVersion: GetConvar("txAdmin-version", "unknown"),
      onesyncEnabled: GetConvar("onesync_enabled", "false"),
      enforceGameBuild: GetConvar("sv_enforceGameBuild", "false"),
      pureLevel: GetConvar("sv_pureLevel", "0"),
      artifactVersion: serverArtifacts.artifactVersion,
      artifactOs: serverArtifacts.artifactOs || "unknown"
    }
  };
}

// Get Initial(all) Server Players
export async function getInitialServerSocketPlayers(): Promise<SocketPlayer[]> {
  const onlinePlayers = getPlayers();
  const players = await Promise.all(onlinePlayers.map(async id => {
    // Player Details
    const name = GetPlayerName(id);
    const identifiers = await getPlayerIdentifiersData(id);
    const characterData: PlayerNameJob = await getPlayerDataSocket(id);
    const isStaff = false; // Future thing

    // Player Position
    //const [x, y, z] = GetEntityCoords(GetPlayerPed(id), true);

    // Player Mugshot
    var mugshot = await triggerClientCallback<{ mugshot: string }>('beacon:getMugshot:client', parseInt(id), [id]);
    if (!mugshot || !mugshot.mugshot) {
      mugshot = { mugshot: "" }; // Default to empty string if no mugshot
    }

    // Player Vehicle
    const isInVehicle = (GetVehiclePedIsIn(GetPlayerPed(id), false) !== 0);
    var vehicle, vehicleData = null;
    if (isInVehicle) {
      vehicle = isInVehicle ? GetVehiclePedIsIn(GetPlayerPed(id), false) : null;
      vehicleData = await triggerClientCallback<{ vehicleDisplayName: string }>('beacon:getVehicleDisplayName:client', parseInt(id), [vehicle])
      if (!vehicleData) {
        vehicleData = { vehicleDisplayName: "Unknown Vehicle" };
      }
    }

    return {
      id,
      identifiers,
      name,
      isStaff,
      isInVehicle,
      //mugshot: "",
      mugshot:  mugshot.mugshot,
      characterName: characterData.name,
      job: characterData.job,
      vehicle: vehicle ? {
        model: String(vehicleData.vehicleDisplayName),
        plate: GetVehicleNumberPlateText(vehicle)
      } : undefined
    };
  }));
  return players;
}
