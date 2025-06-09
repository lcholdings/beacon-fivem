declare const window: {
  GetParentResourceName: () => string;
};

export const ResourceContext = IsDuplicityVersion() ? 'server' : 'client';

export const ResourceName = GetCurrentResourceName();

export const ResourceMetadata = {
  name: ResourceName,
  context: ResourceContext,
  version: GetResourceMetadata(ResourceName, 'version', 0) || 'unknown',
}
