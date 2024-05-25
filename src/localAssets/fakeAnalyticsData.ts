import { FeatureCollection, Point } from 'geojson'

interface FakeAnalyticsDataProperties {
  assetType: string
  country: string
  vulnerability: string
}

export type FakeAnalyticsData = FeatureCollection<
  Point,
  FakeAnalyticsDataProperties
>

export const fakeAnalyticsData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-1.35, 52.24],
      },
      properties: {
        assetType: 'Building',
        country: 'United Kingdom',
        vulnerability: 'Low',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-2.02, 54.14],
      },
      properties: {
        assetType: 'Building',
        country: 'United Kingdom',
        vulnerability: 'High',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-3.73, 52.32],
      },
      properties: {
        assetType: 'Building',
        country: 'United Kingdom',
        vulnerability: 'High',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [1.56, 52.68],
      },
      properties: {
        assetType: 'Building',
        country: 'United Kingdom',
        vulnerability: 'Low',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-5.1, 57.88],
      },
      properties: {
        assetType: 'Building',
        country: 'United Kingdom',
        vulnerability: 'Medium',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-4.7, 53.0],
      },
      properties: {
        assetType: 'Building',
        country: 'United Kingdom',
        vulnerability: 'Medium',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [1.0, 50.22],
      },
      properties: {
        assetType: 'Building',
        country: 'United Kingdom',
        vulnerability: 'High',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0.01, 55.1],
      },
      properties: {
        assetType: 'Building',
        country: 'United Kingdom',
        vulnerability: 'Medium',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-6.01, 56.4],
      },
      properties: {
        assetType: 'Building',
        country: 'United Kingdom',
        vulnerability: 'Low',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [1.0, 50.22],
      },
      properties: {
        assetType: 'Building',
        country: 'United Kingdom',
        vulnerability: 'High',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0.01, 55.1],
      },
      properties: {
        assetType: 'Building',
        country: 'United Kingdom',
        vulnerability: 'Medium',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-6.01, 56.4],
      },
      properties: {
        assetType: 'Building',
        country: 'United Kingdom',
        vulnerability: 'Low',
      },
    },
  ],
}
