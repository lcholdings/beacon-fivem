import Config from '@common/config';
import * as QBox from './qbox/functions';
import * as Standalone from './standalone/functions';
import { PlayerJob, PlayerNameJob } from '../../types/playerData';

export var getPlayerDataSocket: (playerId: string) => Promise<PlayerNameJob>;
export var getPlayerJob: (playerId: string) => Promise<PlayerJob>;
export var getPlayerName: (playerId: string) => Promise<string>;


if (Config.ServerFramework === 'qbox') {
  getPlayerDataSocket = QBox.getQboxPlayerDataSocket;
  getPlayerJob = QBox.getQboxPlayerJob;
  getPlayerName = QBox.getQboxPlayerName;
} else {
  getPlayerDataSocket = Standalone.getStandalonePlayerDataSocket;
  getPlayerJob = Standalone.getStandalonePlayerJob;
  getPlayerName = Standalone.getStandalonePlayerName;
}
