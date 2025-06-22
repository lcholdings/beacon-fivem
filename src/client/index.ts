import { onServerCallback } from '@communityox/ox_lib/client';

// Get Vehicle Display Name
onServerCallback('beacon:client:getVehicleDisplayName', (args: [string]) => {
  const vehicleDisplayName: string = GetDisplayNameFromVehicleModel(args[0]);
  return {
    vehicleDisplayName
  };
});

// Get Player Mugshot
onServerCallback('beacon:getMugshot:client', async (args: [string]) => {
  const MugShot = await exports.MugShotBase64.GetMugShotBase64(PlayerPedId(), true)
  return {
    mugshot: MugShot
  };
});
