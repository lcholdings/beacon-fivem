import Config from '@common/config';
import * as QBox from './qbox/functions';
import * as Standalone from './standalone/functions';
import type { PlayerJob, PlayerNameJob } from '../../types/playerData';

export let getPlayerDataSocket: (playerId: string) => Promise<PlayerNameJob>;
export let getPlayerJob: (playerId: string) => Promise<PlayerJob>;
export let getPlayerName: (playerId: string) => Promise<string>;


if (Config.ServerFramework === 'qbox') {
  getPlayerDataSocket = QBox.getQboxPlayerDataSocket;
  getPlayerJob = QBox.getQboxPlayerJob;
  getPlayerName = QBox.getQboxPlayerName;
} else {
  getPlayerDataSocket = Standalone.getStandalonePlayerDataSocket;
  getPlayerJob = Standalone.getStandalonePlayerJob;
  getPlayerName = Standalone.getStandalonePlayerName;
}
