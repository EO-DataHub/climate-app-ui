export interface LegendParameters {
  intervalRgbaColor: string[]
  intervals: number[][]
}

export const indicatorOptions = [
  {
    value: 'days_tas_above_20c',
    label: 'Days with average temperature above 20°C',
  },
  {
    value: 'days_tas_above_25c',
    label: 'Days with average temperature above 25°C',
  },
  {
    value: 'days_tas_above_28c',
    label: 'Days with average temperature above 28°C',
  },
  {
    value: 'days_tas_above_30c',
    label: 'Days with average temperature above 30°C',
  },
  {
    value: 'days_tas_above_32c',
    label: 'Days with average temperature above 32°C',
  },
  {
    value: 'days_tas_above_35c',
    label: 'Days with average temperature above 35°C',
  },
  {
    value: 'days_tas_above_40c',
    label: 'Days with average temperature above 40°C',
  },
  {
    value: 'days_tas_above_45c',
    label: 'Days with average temperature above 45°C',
  },
  {
    value: 'days_tas_above_50c',
    label: 'Days with average temperature above 50°C',
  },
  {
    value: 'days_tas_above_55c',
    label: 'Days with average temperature above 55°C',
  },
  {
    value: 'mean_degree_days_v2_above_28c',
    label: 'Mean degree days above 28°C',
  },
  {
    value: 'mean_degree_days_v2_above_32c',
    label: 'Mean degree days above 32°C',
  },
]

export const climateModelOptions = [
  { value: 'ACCESS-CM2', label: 'CMIP6: ACCESS-CM2' },
  { value: 'NorESM2-MM', label: 'CMIP6: NorESM2-MM' },
]

export const scenarioOptions = [
  { value: 'ssp126', label: 'SSP1-2.6' },
  { value: 'ssp585', label: 'SSP5-8.5' },
]
export const yearOptions = ['2070', '2080']

export const legendParameters = {
  daysWithAverageTemperatureAbove: {
    intervalRgbaColor: [
      '254,229,217',
      '252,187,161',
      '252,146,114',
      '251,106,74',
      '239,59,44',
      '203,24,29',
      '153,0,13',
    ],
    intervals: [
      [1, 50],
      [50, 100],
      [100, 150],
      [150, 200],
      [200, 250],
      [250, 300],
      [300, 366],
    ],
  },
  meanDegreeDaysAbove: {
    intervalRgbaColor: [
      '255,245,240',
      '254,224,210',
      '252,187,161',
      '252,146,114',
      '251,106,74',
      '239,59,44',
      '203,24,29',
      '165,15,21',
      '103,0,13',
    ],
    intervals: [
      [500, 1000],
      [1000, 1500],
      [1500, 2000],
      [2000, 2500],
      [2500, 3000],
      [3000, 3500],
      [3500, 4000],
      [4000, 4500],
      [4500, 5000],
    ],
  },
}

export const observationMenuItems = [
  {
    label: '2013 05 05 11: 00: 23',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20130505110023-fv1.00.tif',
  },
  {
    label: '2013 06 06 11: 00: 36',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20130606110036-fv1.00.tif',
  },
  {
    label: '2013 06 15 10: 54: 22',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20130615105422-fv1.00.tif',
  },
  {
    label: '2013 07 01 10: 54: 22',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20130701105422-fv1.00.tif',
  },
  {
    label: '2013 07 08 11: 00: 34',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20130708110034-fv1.00.tif',
  },
  {
    label: '2013 07 24 11: 00: 32',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20130724110032-fv1.00.tif',
  },
  {
    label: '2013 09 26 11: 00: 26',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20130926110026-fv1.00.tif',
  },
  {
    label: '2013 11 22 10: 53:58',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20131122105358-fv1.00.tif',
  },
  {
    label: '2013 12 08 10: 54: 00',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20131208105400-fv1.00.tif',
  },
  {
    label: '2014 01 16 10: 59: 43',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20140116105943-fv1.00.tif',
  },
  {
    label: '2014 02 01 10: 59: 38',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20140201105938-fv1.00.tif',
  },
  {
    label: '2014 03 05 10: 59: 08',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20140305105908-fv1.00.tif',
  },
  {
    label: '2014 03 21 10: 58: 58',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20140321105858-fv1.00.tif',
  },
  {
    label: '2014 06 09 10: 58: 15',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20140609105815-fv1.00.tif',
  },
  {
    label: '2014 06 25 10: 58: 17',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20140625105817-fv1.00.tif',
  },
  {
    label: '2014 07 27 10: 58: 29',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20140727105829-fv1.00.tif',
  },
  {
    label: '2014 09 22 10: 52: 29',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20140922105229-fv1.00.tif',
  },
  {
    label: '2015 01 19 10: 58: 34',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20150119105834-fv1.00.tif',
  },
  {
    label: '2015 02 04 10: 58: 30',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20150204105830-fv1.00.tif',
  },
  {
    label: '2015 03 01 10: 52: 09',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20150301105209-fv1.00.tif',
  },
  {
    label: '2015 03 08 10: 58: 15',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20150308105815-fv1.00.tif',
  },
  {
    label: '2015 03 24 10: 58: 06',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20150324105806-fv1.00.tif',
  },
  {
    label: '2015 04 09 10: 57: 56',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20150409105756-fv1.00.tif',
  },
  {
    label: '2015 04 18 10: 51: 46',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20150418105146-fv1.00.tif',
  },
  {
    label: '2015 05 27 10: 57: 38',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20150527105738-fv1.00.tif',
  },
  {
    label: '2015 06 05 10: 51: 34',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20150605105134-fv1.00.tif',
  },
  {
    label: '2015 06 21 10: 51: 42',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20150621105142-fv1.00.tif',
  },
  {
    label: '2015 07 07 10: 51: 52',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20150707105152-fv1.00.tif',
  },
  {
    label: '2015 08 15 10: 58: 17',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20150815105817-fv1.00.tif',
  },
  {
    label: '2015 09 25 10: 52: 23',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20150925105223-fv1.00.tif',
  },
  {
    label: '2015 10 02 10: 58: 35',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20151002105835-fv1.00.tif',
  },
  {
    label: '2015 10 11 10: 52: 24',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20151011105224-fv1.00.tif',
  },
  {
    label: '2015 11 12 10: 52: 29',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20151112105229-fv1.00.tif',
  },
  {
    label: '2016 02 07 10: 58: 35',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20160207105835-fv1.00.tif',
  },
  {
    label: '2016 02 23 10: 58: 28',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20160223105828-fv1.00.tif',
  },
  {
    label: '2016 04 04 10: 52: 02',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20160404105202-fv1.00.tif',
  },
  {
    label: '2016 04 27 10: 58: 07',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20160427105807-fv1.00.tif',
  },
  {
    label: '2016 07 16 10: 58: 32',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20160716105832-fv1.00.tif',
  },
  {
    label: '2016 08 17 10: 58: 39',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20160817105839-fv1.00.tif',
  },
  {
    label: '2016 10 04 10: 58: 50',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20161004105850-fv1.00.tif',
  },
  {
    label: '2016 10 20 10: 58: 55',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20161020105855-fv1.00.tif',
  },
  {
    label: '2017 01 24 10: 58: 40',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20170124105840-fv1.00.tif',
  },
  {
    label: '2017 06 26 10: 52: 09',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20170626105209-fv1.00.tif',
  },
  {
    label: '2017 06 26 10: 52: 33',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20170626105233-fv1.00.tif',
  },
  {
    label: '2017 07 12 10: 52: 12',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20170712105212-fv1.00.tif',
  },
  {
    label: '2017 08 04 10: 58: 33',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20170804105833-fv1.00.tif',
  },
  {
    label: '2017 08 20 10: 58: 38',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20170820105838-fv1.00.tif',
  },
  {
    label: '2017 08 29 10: 52: 29',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20170829105229-fv1.00.tif',
  },
  {
    label: '2018 02 12 10: 58: 23',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20180212105823-fv1.00.tif',
  },
  {
    label: '2018 03 16 10: 58: 07',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20180316105807-fv1.00.tif',
  },
  {
    label: '2018 04 17 10: 57: 52',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20180417105752-fv1.00.tif',
  },
  {
    label: '2018 05 03 10: 57: 43',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20180503105743-fv1.00.tif',
  },
  {
    label: '2018 05 19 10: 57: 32',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20180519105732-fv1.00.tif',
  },
  {
    label: '2018 09 17 10: 52: 01',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20180917105201-fv1.00.tif',
  },
  {
    label: '2018 09 17 10: 52: 25',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20180917105225-fv1.00.tif',
  },
  {
    label: '2018 10 26 10: 58: 28',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20181026105828-fv1.00.tif',
  },
  {
    label: '2018 11 11 10: 58: 30',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20181111105830-fv1.00.tif',
  },
  {
    label: '2019 04 20 10: 58: 00',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20190420105800-fv1.00.tif',
  },
  {
    label: '2020 02 18 10: 58: 35',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20200218105835-fv1.00.tif',
  },
  {
    label: '2020 03 21 10: 58: 22',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20200321105822-fv1.00.tif',
  },
  {
    label: '2020 04 06 10: 58: 13',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20200406105813-fv1.00.tif',
  },
  {
    label: '2020 04 22 10: 58: 07',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20200422105807-fv1.00.tif',
  },
  {
    label: '2021 02 20 10: 58: 37',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20210220105837-fv1.00.tif',
  },
  {
    label: '2021 03 01 10: 52: 22',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20210301105222-fv1.00.tif',
  },
  {
    label: '2021 04 25 10: 58: 10',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20210425105810-fv1.00.tif',
  },
  {
    label: '2021 05 27 10: 58: 16',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20210527105816-fv1.00.tif',
  },
  {
    label: '2021 06 12 10: 58: 23',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20210612105823-fv1.00.tif',
  },
  {
    label: '2021 07 14 10: 58: 29',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20210714105829-fv1.00.tif',
  },
  {
    label: '2021 07 23 10: 52: 22',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20210723105222-fv1.00.tif',
  },
  {
    label: '2021 08 15 10: 58: 43',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20210815105843-fv1.00.tif',
  },
  {
    label: '2021 08 24 10: 52: 34',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20210824105234-fv1.00.tif',
  },
  {
    label: '2021 09 16 10: 58: 51',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20210916105851-fv1.00.tif',
  },
  {
    label: '2021 11 03 10: 58: 59',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20211103105859-fv1.00.tif',
  },
  {
    label: '2022 01 31 10: 52: 32',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20220131105232-fv1.00.tif',
  },
  {
    label: '2022 02 07 10: 58: 41',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20220207105841-fv1.00.tif',
  },
  {
    label: '2022 02 16 10: 52: 27',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20220216105227-fv1.00.tif',
  },
  {
    label: '2022 03 20 10: 52: 16',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20220320105216-fv1.00.tif',
  },
  {
    label: '2022 04 21 10: 52: 12',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20220421105212-fv1.00.tif',
  },
  {
    label: '2022 04 21 10: 52: 36',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20220421105236-fv1.00.tif',
  },
  {
    label: '2022 05 14 10: 58: 29',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20220514105829-fv1.00.tif',
  },
  {
    label: '2022 06 15 10: 58: 45',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20220615105845-fv1.00.tif',
  },
  {
    label: '2022 07 10 10: 52: 37',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20220710105237-fv1.00.tif',
  },
  {
    label: '2022 07 17 10: 58: 49',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20220717105849-fv1.00.tif',
  },
  {
    label: '2022 08 11 10: 52: 54',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20220811105254-fv1.00.tif',
  },
  {
    label: '2022 08 11 10: 53:17',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20220811105317-fv1.00.tif',
  },
  {
    label: '2022 08 27 10: 52: 55',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20220827105255-fv1.00.tif',
  },
  {
    label: '2022 09 12 10: 53:00',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20220912105300-fv1.00.tif',
  },
  {
    label: '2022 09 28 10: 53:02',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20220928105302-fv1.00.tif',
  },
  {
    label: '2022 11 22 10: 59: 07',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20221122105907-fv1.00.tif',
  },
  {
    label: '2023 01 09 10: 58: 57',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20230109105857-fv1.00.tif',
  },
  {
    label: '2023 02 26 10: 58: 38',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20230226105838-fv1.00.tif',
  },
  {
    label: '2023 03 14 10: 58: 32',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20230314105832-fv1.00.tif',
  },
  {
    label: '2023 03 30 10: 58: 22',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20230330105822-fv1.00.tif',
  },
  {
    label: '2023 10 24 10: 58: 45',
    value:
      's3://lst-cogs/london/ESACCI-LST-L2P-LST-LNDST8-LONDON-20231024105845-fv1.00.tif',
  },
]
