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
      default: 'Chronic heat',
    },
    indicator: {
      title: 'Hazard Indicator',
      type: 'string',
      oneOf: [
        {
          title: 'Mean degree days above 32\u00b0C',
          const: 'chronic_heat_osc_v2_mean_degree_days_v2_above_32c',
        },
        {
          title: 'Days per year above 35\u00b0C (Jupiter)',
          const: 'chronic_heat_jupiter_v1_days_above_35c',
        },
        {
          title: 'Mean work loss, low intensity',
          const: 'chronic_heat_osc_v2_mean_work_loss_low',
        },
        {
          title: 'Mean work loss, medium intensity',
          const: 'chronic_heat_osc_v2_mean_work_loss_medium',
        },
        {
          title: 'Mean work loss, high intensity',
          const: 'chronic_heat_osc_v2_mean_work_loss_high',
        },
        {
          title: 'Days with average temperature above 25\u00b0C',
          const: 'chronic_heat_osc_v2_days_tas_above_25c',
        },
        {
          title: 'Days with average temperature above 30\u00b0C',
          const: 'chronic_heat_osc_v2_days_tas_above_30c',
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
          title: 'Mean degree days above index value',
          const: 'chronic_heat_osc_v2_mean_degree_days_above_index',
        },
        {
          title: 'Mean degree days below index value',
          const: 'chronic_heat_osc_v2_mean_degree_days_below_index',
        },
        {
          title:
            'Weeks with average water temperature above threshold in \u00b0C',
          const: 'chronic_heat_nluu_v2_weeks_water_temp_above',
        },
        {
          title:
            'Days with wet-bulb globe temperature above threshold in \u00b0C',
          const: 'chronic_heat_osc_v2_days_wbgt_above',
        },
      ],
    },
  },
  allOf: [
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
            $ref: '#/definitions/4e72f8780a9d80ebff2a317bfa08b6e87ad56a4f60853d3b6179ec1bcc136ed9',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CMCC-ESM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CNRM-CM6-1',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MIROC6',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MPI-ESM1-2-LR',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
            const: 'chronic_heat_jupiter_v1_days_above_35c',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/6c77355ebd2758a915370ab6115f5f67f36c98ce4a23f7573c70c0a36b1d97c2',
          },
        },
        allOf: [
          {
            if: {
              properties: {
                climate_model: {
                  const: 'unknown',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/f3e25662008c363cd4af6c9d5a2f31fc92036885f6a01d3c9a1d1e812c8e3c9d',
                },
              },
              allOf: [
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
                        $ref: '#/definitions/71e7d1a47ce41d3ecd64c5870aaa005b61621ed2d17d8d1a7fe71281ee1fe1fd',
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
                        $ref: '#/definitions/71e7d1a47ce41d3ecd64c5870aaa005b61621ed2d17d8d1a7fe71281ee1fe1fd',
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
            const: 'chronic_heat_osc_v2_mean_work_loss_low',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/dfb040e16556ea894d2f7a63f46353fc34e56707c4f10c2ce050ec06ea5b7286',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CMCC-ESM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CNRM-CM6-1',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MPI-ESM1-2-LR',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MIROC6',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
            const: 'chronic_heat_osc_v2_mean_work_loss_medium',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/dfb040e16556ea894d2f7a63f46353fc34e56707c4f10c2ce050ec06ea5b7286',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CMCC-ESM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CNRM-CM6-1',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MPI-ESM1-2-LR',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MIROC6',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
            const: 'chronic_heat_osc_v2_mean_work_loss_high',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/dfb040e16556ea894d2f7a63f46353fc34e56707c4f10c2ce050ec06ea5b7286',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CMCC-ESM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CNRM-CM6-1',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MPI-ESM1-2-LR',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MIROC6',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
            $ref: '#/definitions/dfb040e16556ea894d2f7a63f46353fc34e56707c4f10c2ce050ec06ea5b7286',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CMCC-ESM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CNRM-CM6-1',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MPI-ESM1-2-LR',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MIROC6',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
            $ref: '#/definitions/dfb040e16556ea894d2f7a63f46353fc34e56707c4f10c2ce050ec06ea5b7286',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CMCC-ESM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CNRM-CM6-1',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MPI-ESM1-2-LR',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MIROC6',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
            $ref: '#/definitions/dfb040e16556ea894d2f7a63f46353fc34e56707c4f10c2ce050ec06ea5b7286',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CMCC-ESM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CNRM-CM6-1',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MPI-ESM1-2-LR',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MIROC6',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
            $ref: '#/definitions/dfb040e16556ea894d2f7a63f46353fc34e56707c4f10c2ce050ec06ea5b7286',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CMCC-ESM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CNRM-CM6-1',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MPI-ESM1-2-LR',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MIROC6',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
            $ref: '#/definitions/dfb040e16556ea894d2f7a63f46353fc34e56707c4f10c2ce050ec06ea5b7286',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CMCC-ESM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CNRM-CM6-1',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MPI-ESM1-2-LR',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MIROC6',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
            $ref: '#/definitions/dfb040e16556ea894d2f7a63f46353fc34e56707c4f10c2ce050ec06ea5b7286',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CMCC-ESM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CNRM-CM6-1',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MPI-ESM1-2-LR',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MIROC6',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
            $ref: '#/definitions/dfb040e16556ea894d2f7a63f46353fc34e56707c4f10c2ce050ec06ea5b7286',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CMCC-ESM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CNRM-CM6-1',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MPI-ESM1-2-LR',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MIROC6',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
            const: 'chronic_heat_osc_v2_mean_degree_days_above_index',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/dfb040e16556ea894d2f7a63f46353fc34e56707c4f10c2ce050ec06ea5b7286',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CMCC-ESM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CNRM-CM6-1',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MPI-ESM1-2-LR',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MIROC6',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
            const: 'chronic_heat_osc_v2_mean_degree_days_below_index',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/dfb040e16556ea894d2f7a63f46353fc34e56707c4f10c2ce050ec06ea5b7286',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CMCC-ESM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CNRM-CM6-1',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MPI-ESM1-2-LR',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MIROC6',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
            const: 'chronic_heat_nluu_v2_weeks_water_temp_above',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/4b42dbb7d149e8dc561128c54ae8da1ebfc49108cb1a569b2598a1deb288e7f0',
          },
        },
        allOf: [
          {
            if: {
              properties: {
                climate_model: {
                  const: 'GFDL',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/0551334d0f00c3a03b0202a5ea7bfa0c544c349b0fb81717d698f7dabadd5611',
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
                        $ref: '#/definitions/c7462e2f751258fa7310f5fff24d5252def80f9a5e73675547bd90401c99931d',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp2p6',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp4p5',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp6p0',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp8p5',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
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
                  const: 'HadGEM',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/0551334d0f00c3a03b0202a5ea7bfa0c544c349b0fb81717d698f7dabadd5611',
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
                        $ref: '#/definitions/c7462e2f751258fa7310f5fff24d5252def80f9a5e73675547bd90401c99931d',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp2p6',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp4p5',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp6p0',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp8p5',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
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
                  const: 'IPSL',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/0551334d0f00c3a03b0202a5ea7bfa0c544c349b0fb81717d698f7dabadd5611',
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
                        $ref: '#/definitions/c7462e2f751258fa7310f5fff24d5252def80f9a5e73675547bd90401c99931d',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp2p6',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp4p5',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp6p0',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp8p5',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
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
                  const: 'MIROC',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/0551334d0f00c3a03b0202a5ea7bfa0c544c349b0fb81717d698f7dabadd5611',
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
                        $ref: '#/definitions/c7462e2f751258fa7310f5fff24d5252def80f9a5e73675547bd90401c99931d',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp2p6',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp4p5',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp6p0',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp8p5',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
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
                  const: 'NorESM',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/0551334d0f00c3a03b0202a5ea7bfa0c544c349b0fb81717d698f7dabadd5611',
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
                        $ref: '#/definitions/c7462e2f751258fa7310f5fff24d5252def80f9a5e73675547bd90401c99931d',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp2p6',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp4p5',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp6p0',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'rcp8p5',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828',
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
                  const: 'E2O',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/bbe41a8040ad86ee6874c135f03f4ae5aac2e307b9e240baa4ddf46870efc25e',
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
                        $ref: '#/definitions/c7462e2f751258fa7310f5fff24d5252def80f9a5e73675547bd90401c99931d',
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
            const: 'chronic_heat_osc_v2_days_wbgt_above',
          },
        },
      },
      then: {
        properties: {
          climate_model: {
            $ref: '#/definitions/dfb040e16556ea894d2f7a63f46353fc34e56707c4f10c2ce050ec06ea5b7286',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp370',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CMCC-ESM2',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp370',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'CNRM-CM6-1',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp370',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MPI-ESM1-2-LR',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp370',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  const: 'MIROC6',
                },
              },
            },
            then: {
              properties: {
                scenario: {
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp370',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                  $ref: '#/definitions/65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp245',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: {
                      scenario: {
                        const: 'ssp370',
                      },
                    },
                  },
                  then: {
                    properties: {
                      year: {
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
                        $ref: '#/definitions/08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc',
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
    '87d0f2fe18d90265ab849206719f3b26ea172e7cdde069781d6cc8ef56159f66': {
      title: 'Scenario',
      type: 'string',
      enum: ['historical', 'ssp126', 'ssp245', 'ssp585'],
    },
    c640724dfb0e499d855678cd414ed5ed2ea5548f823aa2916ca14dd91bcbe59a: {
      title: 'Year',
      type: 'string',
      enum: ['2005'],
    },
    '1ebcaaca655fdbfb20a6daec4abafe5d893a81e6c69441e5607da123076eb015': {
      title: 'Year',
      type: 'string',
      enum: ['2030', '2040', '2050'],
    },
    '4e72f8780a9d80ebff2a317bfa08b6e87ad56a4f60853d3b6179ec1bcc136ed9': {
      title: 'Climate Model',
      type: 'string',
      oneOf: [
        {
          title: 'ACCESS-CM2',
          const: 'ACCESS-CM2',
        },
        {
          title: 'CMCC-ESM2',
          const: 'CMCC-ESM2',
        },
        {
          title: 'CNRM-CM6-1',
          const: 'CNRM-CM6-1',
        },
        {
          title: 'MIROC6',
          const: 'MIROC6',
        },
        {
          title: 'MPI-ESM1-2-LR',
          const: 'MPI-ESM1-2-LR',
        },
        {
          title: 'NorESM2-MM',
          const: 'NorESM2-MM',
        },
      ],
    },
    f3e25662008c363cd4af6c9d5a2f31fc92036885f6a01d3c9a1d1e812c8e3c9d: {
      title: 'Scenario',
      type: 'string',
      enum: ['ssp126', 'ssp585'],
    },
    '71e7d1a47ce41d3ecd64c5870aaa005b61621ed2d17d8d1a7fe71281ee1fe1fd': {
      title: 'Year',
      type: 'string',
      enum: ['2020', '2030', '2040', '2050', '2075', '2100'],
    },
    '6c77355ebd2758a915370ab6115f5f67f36c98ce4a23f7573c70c0a36b1d97c2': {
      title: 'Climate Model',
      type: 'string',
      oneOf: [
        {
          title: 'unknown',
          const: 'unknown',
        },
      ],
    },
    dfb040e16556ea894d2f7a63f46353fc34e56707c4f10c2ce050ec06ea5b7286: {
      title: 'Climate Model',
      type: 'string',
      oneOf: [
        {
          title: 'ACCESS-CM2',
          const: 'ACCESS-CM2',
        },
        {
          title: 'CMCC-ESM2',
          const: 'CMCC-ESM2',
        },
        {
          title: 'CNRM-CM6-1',
          const: 'CNRM-CM6-1',
        },
        {
          title: 'MPI-ESM1-2-LR',
          const: 'MPI-ESM1-2-LR',
        },
        {
          title: 'MIROC6',
          const: 'MIROC6',
        },
        {
          title: 'NorESM2-MM',
          const: 'NorESM2-MM',
        },
      ],
    },
    '0551334d0f00c3a03b0202a5ea7bfa0c544c349b0fb81717d698f7dabadd5611': {
      title: 'Scenario',
      type: 'string',
      enum: ['historical', 'rcp2p6', 'rcp4p5', 'rcp6p0', 'rcp8p5'],
    },
    c7462e2f751258fa7310f5fff24d5252def80f9a5e73675547bd90401c99931d: {
      title: 'Year',
      type: 'string',
      enum: ['1991'],
    },
    '2d82902eccf459c39cd83e130ab56b0851076b9dfdbf6489eda32b71b3279828': {
      title: 'Year',
      type: 'string',
      enum: ['2020', '2030', '2040', '2050', '2060', '2070', '2080', '2090'],
    },
    bbe41a8040ad86ee6874c135f03f4ae5aac2e307b9e240baa4ddf46870efc25e: {
      title: 'Scenario',
      type: 'string',
      enum: ['historical'],
    },
    '4b42dbb7d149e8dc561128c54ae8da1ebfc49108cb1a569b2598a1deb288e7f0': {
      title: 'Climate Model',
      type: 'string',
      oneOf: [
        {
          title: 'GFDL',
          const: 'GFDL',
        },
        {
          title: 'HadGEM',
          const: 'HadGEM',
        },
        {
          title: 'IPSL',
          const: 'IPSL',
        },
        {
          title: 'MIROC',
          const: 'MIROC',
        },
        {
          title: 'NorESM',
          const: 'NorESM',
        },
        {
          title: 'E2O',
          const: 'E2O',
        },
      ],
    },
    '65f737a35b0d6a7556a9aa400e10d1cb1cc96e0c3fb2f7e552b5ebef2ffed173': {
      title: 'Scenario',
      type: 'string',
      enum: ['historical', 'ssp126', 'ssp245', 'ssp370', 'ssp585'],
    },
    '08284b6be5c4600da082c0217f69345523512bcb4c8434e362456ca35e4fa8cc': {
      title: 'Year',
      type: 'string',
      enum: ['2030', '2040', '2050', '2060', '2070', '2080', '2090'],
    },
  },
}
