import Config from "@common/config"

export const WebSocketURL = Config.API.UseSecureConnection ?
  `wss://${Config.API.BaseUrl}`
  : `ws://${Config.API.BaseUrl}`;

export const APIURL = Config.API.UseSecureConnection ?
  `https://${Config.API.BaseUrl}`
  : `http://${Config.API.BaseUrl}`;
