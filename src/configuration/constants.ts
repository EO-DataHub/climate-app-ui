export enum MapSourceIds {
  HAZARDS = 'hazard',
  OBSERVATIONS = 'observations',
  USER_ASSETS = 'user-assets',
  BASEMAP = 'basemap',
}

export const MAP_MAX_ZOOM = 18

export enum MapLayerIds {
  USER_ASSETS_UNCLUSTERED = 'user-assets-unclustered',
  USER_ASSETS_CLUSTERED = 'user-assets-clustered',
  USER_ASSETS_CLUSTER_COUNT = 'user-assets-cluster-count',
}

export const UNSAVED_PORTFOLIO_VALUE_FOR_SELECT_INPUT = 'unsavedAssets'
export const MAPLIBRE_FIT_BOUNDS_PADDING = 100
export const MAPLIBRE_FIT_BOUNDS_MAX_ZOOM = 10

export enum AssetImpactViewOptions {
  LIST = 'list',
  DETAILS = 'details',
}

export enum HubWorkflowNicknames {
  OSC = 'OS-Climate',
  LST = 'LST',
}

export type HubWorkflowNicknamesType = `${HubWorkflowNicknames}`

export const workflowHubNames = {
  [HubWorkflowNicknames.OSC]: 'get-asset-impact-workflow-sparkgeouser',
  [HubWorkflowNicknames.LST]: 'get-asset-values-workflow-nostac',
}

export const DEFAULT_USER_ASSET_COLUMNS = ['latitude', 'longitude', 'id', '']
