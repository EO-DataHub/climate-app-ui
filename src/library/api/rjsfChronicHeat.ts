import { RJSFSchema } from '@rjsf/utils'
import {
  climateModelPopupContent,
  hazardIndicatorPopupContent,
  hazardTypePopupContent,
  scenarioPopupContent,
  yearPopupContent,
} from '../../configuration/infoPopupContentHazards.tsx'
import { UiSchema } from '@rjsf/utils/src/types.ts'
import { CustomObjectFieldTemplate } from '../../components/pages/Hazards/HazardsFieldsLayoutTemplate.tsx'

// I originally expected this to come from the remote server,
// but this is the only place I can get the custom template to work.
// Also the descriptions here use HTML tags, but RJSF only renders plain text.
// There is a way to get it to render HTML or Markdown, but I can't get it to
// work right now.
// So this UiSchema should be left in code for now.
export const chronicHeatUiSchema: UiSchema = {
  hazard: {
    'ui:widget': 'customSelect',
    'ui:label': false,
    'ui:description': hazardTypePopupContent,
  },
  indicator: {
    'ui:widget': 'customSelect',
    'ui:label': false,
    'ui:description': hazardIndicatorPopupContent,
  },
  climate_model: {
    'ui:widget': 'customSelect',
    'ui:label': false,
    'ui:description': climateModelPopupContent,
  },
  scenario: {
    'ui:widget': 'customSelect',
    'ui:label': false,
    'ui:description': scenarioPopupContent,
  },
  year: {
    'ui:widget': 'customSelect',
    'ui:label': false,
    'ui:description': yearPopupContent,
  },
  'ui:submitButtonOptions': {
    norender: true,
  },
  'ui:ObjectFieldTemplate': CustomObjectFieldTemplate,
}

export const chronicHeatSchema: RJSFSchema = {
  type: 'object',
  properties: {
    hazard: {
      title: 'Hazard',
      type: 'string',
      oneOf: [
        {
          title: 'Chronic heat',
          const: 'chronic_heat',
        },
      ],
    },
    indicator: {
      title: 'Hazard Indicator',
      type: 'string',
      oneOf: [
        {
          title: 'Days with average temperature above 20\u00b0C',
          const: 'chronic_heat_osc_v2_days_tas_above_20c',
        },
        {
          title: 'Days with average temperature above 25\u00b0C',
          const: 'chronic_heat_osc_v2_days_tas_above_25c',
        },
        {
          title: 'Days with average temperature above 28\u00b0C',
          const: 'chronic_heat_osc_v2_days_tas_above_28c',
        },
        {
          title: 'Days with average temperature above 30\u00b0C',
          const: 'chronic_heat_osc_v2_days_tas_above_30c',
        },
        {
          title: 'Days with average temperature above 32\u00b0C',
          const: 'chronic_heat_osc_v2_days_tas_above_32c',
        },
        {
          title: 'Days with average temperature above 35\u00b0C',
          const: 'chronic_heat_osc_v2_days_tas_above_35c',
        },
        {
          title: 'Days with average temperature above 40\u00b0C',
          const: 'chronic_heat_osc_v2_days_tas_above_40c',
        },
        {
          title: 'Days with average temperature above 45\u00b0C',
          const: 'chronic_heat_osc_v2_days_tas_above_45c',
        },
        {
          title: 'Days with average temperature above 50\u00b0C',
          const: 'chronic_heat_osc_v2_days_tas_above_50c',
        },
        {
          title: 'Days with average temperature above 55\u00b0C',
          const: 'chronic_heat_osc_v2_days_tas_above_55c',
        },
        {
          title: 'Mean degree days above 28\u00b0C',
          const: 'chronic_heat_osc_v2_mean_degree_days_v2_above_28c',
        },
        {
          title: 'Mean degree days above 32\u00b0C',
          const: 'chronic_heat_osc_v2_mean_degree_days_v2_above_32c',
        },
      ],
    },
  },
  allOf: [
    {
      if: {
        properties: {
          indicator: {
            const: 'chronic_heat_osc_v2_days_tas_above_20c',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/13edd76604ff08a012c1be7e370ac3892805fbd729d1d0f67fa53cab77c5be97',
          },
        },
        allOf: [
          {
            if: {
              properties: {
                climate_model: {
                  const: 'ACCESS-CM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            if: {
              properties: {
                climate_model: {
                  const: 'NorESM2-MM',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
            else: {
              properties: {
                scenario: {
                  title: 'Scenario',
                  type: 'string',
                },
                year: {
                  title: 'Year',
                  type: 'string',
                },
              },
            },
          },
        ],
      },
    },
    {
      if: {
        properties: {
          indicator: {
            const: 'chronic_heat_osc_v2_days_tas_above_25c',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/13edd76604ff08a012c1be7e370ac3892805fbd729d1d0f67fa53cab77c5be97',
          },
        },
        allOf: [
          {
            if: {
              properties: {
                climate_model: {
                  const: 'ACCESS-CM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            if: {
              properties: {
                climate_model: {
                  const: 'NorESM2-MM',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
            else: {
              properties: {
                scenario: {
                  title: 'Scenario',
                  type: 'string',
                },
                year: {
                  title: 'Year',
                  type: 'string',
                },
              },
            },
          },
        ],
      },
    },
    {
      if: {
        properties: {
          indicator: {
            const: 'chronic_heat_osc_v2_days_tas_above_28c',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/13edd76604ff08a012c1be7e370ac3892805fbd729d1d0f67fa53cab77c5be97',
          },
        },
        allOf: [
          {
            if: {
              properties: {
                climate_model: {
                  const: 'ACCESS-CM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            if: {
              properties: {
                climate_model: {
                  const: 'NorESM2-MM',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
            else: {
              properties: {
                scenario: {
                  title: 'Scenario',
                  type: 'string',
                },
                year: {
                  title: 'Year',
                  type: 'string',
                },
              },
            },
          },
        ],
      },
    },
    {
      if: {
        properties: {
          indicator: {
            const: 'chronic_heat_osc_v2_days_tas_above_30c',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/13edd76604ff08a012c1be7e370ac3892805fbd729d1d0f67fa53cab77c5be97',
          },
        },
        allOf: [
          {
            if: {
              properties: {
                climate_model: {
                  const: 'ACCESS-CM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            if: {
              properties: {
                climate_model: {
                  const: 'NorESM2-MM',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
            else: {
              properties: {
                scenario: {
                  title: 'Scenario',
                  type: 'string',
                },
                year: {
                  title: 'Year',
                  type: 'string',
                },
              },
            },
          },
        ],
      },
    },
    {
      if: {
        properties: {
          indicator: {
            const: 'chronic_heat_osc_v2_days_tas_above_32c',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/13edd76604ff08a012c1be7e370ac3892805fbd729d1d0f67fa53cab77c5be97',
          },
        },
        allOf: [
          {
            if: {
              properties: {
                climate_model: {
                  const: 'ACCESS-CM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            if: {
              properties: {
                climate_model: {
                  const: 'NorESM2-MM',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
            else: {
              properties: {
                scenario: {
                  title: 'Scenario',
                  type: 'string',
                },
                year: {
                  title: 'Year',
                  type: 'string',
                },
              },
            },
          },
        ],
      },
    },
    {
      if: {
        properties: {
          indicator: {
            const: 'chronic_heat_osc_v2_days_tas_above_35c',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/13edd76604ff08a012c1be7e370ac3892805fbd729d1d0f67fa53cab77c5be97',
          },
        },
        allOf: [
          {
            if: {
              properties: {
                climate_model: {
                  const: 'ACCESS-CM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            if: {
              properties: {
                climate_model: {
                  const: 'NorESM2-MM',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
            else: {
              properties: {
                scenario: {
                  title: 'Scenario',
                  type: 'string',
                },
                year: {
                  title: 'Year',
                  type: 'string',
                },
              },
            },
          },
        ],
      },
    },
    {
      if: {
        properties: {
          indicator: {
            const: 'chronic_heat_osc_v2_days_tas_above_40c',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/13edd76604ff08a012c1be7e370ac3892805fbd729d1d0f67fa53cab77c5be97',
          },
        },
        allOf: [
          {
            if: {
              properties: {
                climate_model: {
                  const: 'ACCESS-CM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            if: {
              properties: {
                climate_model: {
                  const: 'NorESM2-MM',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
            else: {
              properties: {
                scenario: {
                  title: 'Scenario',
                  type: 'string',
                },
                year: {
                  title: 'Year',
                  type: 'string',
                },
              },
            },
          },
        ],
      },
    },
    {
      if: {
        properties: {
          indicator: {
            const: 'chronic_heat_osc_v2_days_tas_above_45c',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/13edd76604ff08a012c1be7e370ac3892805fbd729d1d0f67fa53cab77c5be97',
          },
        },
        allOf: [
          {
            if: {
              properties: {
                climate_model: {
                  const: 'ACCESS-CM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            if: {
              properties: {
                climate_model: {
                  const: 'NorESM2-MM',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
            else: {
              properties: {
                scenario: {
                  title: 'Scenario',
                  type: 'string',
                },
                year: {
                  title: 'Year',
                  type: 'string',
                },
              },
            },
          },
        ],
      },
    },
    {
      if: {
        properties: {
          indicator: {
            const: 'chronic_heat_osc_v2_days_tas_above_50c',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/13edd76604ff08a012c1be7e370ac3892805fbd729d1d0f67fa53cab77c5be97',
          },
        },
        allOf: [
          {
            if: {
              properties: {
                climate_model: {
                  const: 'ACCESS-CM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            if: {
              properties: {
                climate_model: {
                  const: 'NorESM2-MM',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
            else: {
              properties: {
                scenario: {
                  title: 'Scenario',
                  type: 'string',
                },
                year: {
                  title: 'Year',
                  type: 'string',
                },
              },
            },
          },
        ],
      },
    },
    {
      if: {
        properties: {
          indicator: {
            const: 'chronic_heat_osc_v2_days_tas_above_55c',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/13edd76604ff08a012c1be7e370ac3892805fbd729d1d0f67fa53cab77c5be97',
          },
        },
        allOf: [
          {
            if: {
              properties: {
                climate_model: {
                  const: 'ACCESS-CM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            if: {
              properties: {
                climate_model: {
                  const: 'NorESM2-MM',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
            else: {
              properties: {
                scenario: {
                  title: 'Scenario',
                  type: 'string',
                },
                year: {
                  title: 'Year',
                  type: 'string',
                },
              },
            },
          },
        ],
      },
    },
    {
      if: {
        properties: {
          indicator: {
            const: 'chronic_heat_osc_v2_mean_degree_days_v2_above_28c',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/13edd76604ff08a012c1be7e370ac3892805fbd729d1d0f67fa53cab77c5be97',
          },
        },
        allOf: [
          {
            if: {
              properties: {
                climate_model: {
                  const: 'ACCESS-CM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            if: {
              properties: {
                climate_model: {
                  const: 'NorESM2-MM',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
            else: {
              properties: {
                scenario: {
                  title: 'Scenario',
                  type: 'string',
                },
                year: {
                  title: 'Year',
                  type: 'string',
                },
              },
            },
          },
        ],
      },
    },
    {
      if: {
        properties: {
          indicator: {
            const: 'chronic_heat_osc_v2_mean_degree_days_v2_above_32c',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/13edd76604ff08a012c1be7e370ac3892805fbd729d1d0f67fa53cab77c5be97',
          },
        },
        allOf: [
          {
            if: {
              properties: {
                climate_model: {
                  const: 'ACCESS-CM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            if: {
              properties: {
                climate_model: {
                  const: 'NorESM2-MM',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30',
                },
              },
              allOf: [
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'historical',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp126',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp585',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6',
                      },
                    },
                  },
                  else: {
                    properties: {
                      year: {
                        title: 'Year',
                        type: 'string',
                      },
                    },
                  },
                },
              ],
            },
            else: {
              properties: {
                scenario: {
                  title: 'Scenario',
                  type: 'string',
                },
                year: {
                  title: 'Year',
                  type: 'string',
                },
              },
            },
          },
        ],
      },
      else: {
        properties: {
          climate_model: {
            title: 'Climate Model',
            type: 'string',
          },
          scenario: {
            title: 'Scenario',
            type: 'string',
          },
          year: {
            title: 'Year',
            type: 'string',
          },
        },
      },
    },
  ],
  definitions: {
    d6f3d1a437183f62d9595a55b9d60d4a9c278b8b4f64149fde35cffb6ef6ad30: {
      title: 'Scenario',
      type: 'string',
      enum: ['historical', 'ssp126', 'ssp585'],
    },
    c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a: {
      title: 'Year',
      type: 'string',
      enum: ['2005'],
    },
    '1e0b294e4a01a5ebe3f6807958f19c7babec90d762f8343a31b7eff8ba9866b6': {
      title: 'Year',
      type: 'string',
      enum: ['2070', '2080'],
    },
    '13edd76604ff08a012c1be7e370ac3892805fbd729d1d0f67fa53cab77c5be97': {
      title: 'Climate Model',
      type: 'string',
      oneOf: [
        {
          title: 'ACCESS-CM2',
          const: 'ACCESS-CM2',
        },
        {
          title: 'NorESM2-MM',
          const: 'NorESM2-MM',
        },
      ],
    },
  },
}
