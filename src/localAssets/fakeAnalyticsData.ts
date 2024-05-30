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
        coordinates: [-1.357346, 52.24427347],
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
        coordinates: [-2.02442523, 54.14552343],
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
        coordinates: [-3.733253, 52.32235252],
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
        coordinates: [1.56325235, 52.6823523523],
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
        coordinates: [-5.132523523, 57.883252352],
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
        coordinates: [-4.723523523, 53.023523523],
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
        coordinates: [1.023523523, 50.2223523523],
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
        coordinates: [0.01235235, 55.18956856],
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
        coordinates: [-6.01235235, 56.41976956],
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
        coordinates: [1.043634, 50.224363463],
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
        coordinates: [-6.0134634, 56.4436734634],
      },
      properties: {
        assetType: 'Building',
        country: 'United Kingdom',
        vulnerability: 'Low',
      },
    },
  ],
}
