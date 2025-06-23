import type { SocketPlayer } from '@beacon-oss/types';
import type { Player } from '../../../types/frameworks/qbox';
import type { PlayerJob } from '../../../types/playerData';

type QboxPlayerDataSocket = {
  job: SocketPlayer["job"];
  name: SocketPlayer["name"];
};

export async function getQboxPlayerDataSocket(playerId: string): Promise<QboxPlayerDataSocket> {
  const player: Player = await exports.qbx_core.GetPlayer(playerId);
  if (!player || !player.PlayerData || !player.PlayerData.job || !player.PlayerData.job.grade) {
    throw new Error('PlayerData is undefined or incomplete');
  }
  return {
    job: {
      name: player.PlayerData.job.label,
      grade: player.PlayerData.job.grade.name
    },
    name: `${player.PlayerData.charinfo.firstname} ${player.PlayerData.charinfo.lastname}`
  };
}

export async function getQboxPlayerJob(playerId: string): Promise<PlayerJob> {
  const player: Player = await exports.qbx_core.GetPlayersData(playerId)
  return {
    name: player.PlayerData.job.name,
    grade: player.PlayerData.job.grade.name
  }
}

export async function getQboxPlayerName(playerId: string): Promise<string> {
  const player: Player = await exports.qbx_core.GetPlayersData(playerId);
  return player.PlayerData.name;
}
