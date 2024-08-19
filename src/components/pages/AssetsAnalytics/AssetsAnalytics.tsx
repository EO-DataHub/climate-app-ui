import { RadioGroup, Select } from '@radix-ui/themes'
import { useEffect, useMemo, useState } from 'react'

import {
  AssetImpactViewOptions,
  CurrentHubWorkflowNicknames,
} from '../../../configuration/constants'
import { AssetsTable } from '../../AssetsTable/AssetsTable'
import {
  fakeLstResultsData,
  fakeOscResultsData,
} from '../../../library/api/fakeApiData'
import { PageLayout } from '../../Layout/PageLayout'
import { PageSubtitle } from '../../PageSubtitle'
import { PageTitle } from '../../PageTitle'
import {
  RowSelection,
  UserAssets,
} from '../../../library/userAssets/userAssetTypes'
import analyticsStyles from './AssetsAnalytics.module.scss'
import formStyles from '../../../library/genericStyles/forms.module.scss'
import { AssetImpactsDetails } from './AssetImpactsDetails'
import { toast } from 'react-toastify'
import {
  AnalysedOscUserAssetForTable,
  getLstResultsTableData,
  getOscResultsTableData,
} from '../../../library/userAssets/convertUserAssets'

export const AssetsAnalytics = () => {
  const [assetToDetailId, setAssetToDetailId] = useState<
    string | number | undefined
  >()
  const [hazardTypeFilterOptions, setHazardTypeFilterOptions] = useState<
    string[]
  >(['ChronicHeat'])
  const [hazardTypeFilterValue, setHazardTypeFilterValue] = useState<string>()
  const [rowSelection, setRowSelection] = useState<RowSelection>({})
  const [scenarioFilterOptions, setScenarioFilterOptions] = useState<string[]>()
  const [scenarioFilterValue, setScenarioFilterValue] = useState<string>()
  const [selectedAssetImpactView, setSelectedAssetImpactView] =
    useState<AssetImpactViewOptions>(AssetImpactViewOptions.LIST)
  const [yearFilterOptions, setYearFilterOptions] = useState<string[]>()
  const [yearFilterValue, setYearFilterValue] = useState<string>()

  const currentWorkflowNickname = CurrentHubWorkflowNicknames.OSC as string

  const userAssets = (
    currentWorkflowNickname === (CurrentHubWorkflowNicknames.OSC as string)
      ? fakeOscResultsData
      : fakeLstResultsData
  ) as UserAssets

  const uploadedFileName = 'fakeFileName.csv'

  const userAssetsForTable = useMemo(
    () =>
      currentWorkflowNickname === (CurrentHubWorkflowNicknames.OSC as string)
        ? getOscResultsTableData(userAssets)
        : getLstResultsTableData(userAssets),

    [currentWorkflowNickname, userAssets],
  )
  const filteredUserAssetsForTable = useMemo(() => {
    return userAssetsForTable.filter(
      (asset: AnalysedOscUserAssetForTable) =>
        (yearFilterValue ? asset.year === yearFilterValue : true) &&
        (scenarioFilterValue ? asset.scenario === scenarioFilterValue : true) &&
        (hazardTypeFilterValue
          ? asset.hazardType === hazardTypeFilterValue
          : true),
    )
  }, [
    hazardTypeFilterValue,
    scenarioFilterValue,
    userAssetsForTable,
    yearFilterValue,
  ])

  useEffect(
    function generateOscFilterOptions() {
      const years: string[] = []
      const scenarios: string[] = []
      const hazardTypes: string[] = []

      const analysedOscUserAssetForTable =
        userAssetsForTable as AnalysedOscUserAssetForTable[]
      analysedOscUserAssetForTable.forEach(({ year, scenario, hazardType }) => {
        if (year && year.toLowerCase() !== 'none') {
          years.push(year)
        }
        if (scenario && scenario.toLowerCase() !== 'historical') {
          scenarios.push(scenario)
        }
        if (hazardType) {
          hazardTypes.push(hazardType)
        }
      })

      const uniqueYears = [...new Set(years)]
      const uniqueScenarios = [...new Set(scenarios)]
      const uniqueHazardTypes = [...new Set(hazardTypes)]

      setYearFilterOptions(uniqueYears.sort())
      setScenarioFilterOptions(uniqueScenarios.sort())
      setHazardTypeFilterOptions(uniqueHazardTypes.sort())
    },
    [userAssetsForTable],
  )

  useEffect(
    function initiateYearFilter() {
      if (
        !yearFilterOptions?.length ||
        !setYearFilterValue ||
        !setYearFilterOptions
      )
        return

      setYearFilterValue(yearFilterOptions[0])
    },
    [setYearFilterValue, yearFilterOptions],
  )

  useEffect(
    function initiateScenarioFilter() {
      if (
        !scenarioFilterOptions?.length ||
        !setScenarioFilterValue ||
        !scenarioFilterOptions
      )
        return

      setScenarioFilterValue(scenarioFilterOptions[0])
    },
    [scenarioFilterOptions, setScenarioFilterValue],
  )

  useEffect(
    function initiateIndicatorFilter() {
      if (
        !hazardTypeFilterOptions?.length ||
        !setHazardTypeFilterValue ||
        !hazardTypeFilterOptions
      )
        return

      setHazardTypeFilterValue(hazardTypeFilterOptions[0])
    },
    [hazardTypeFilterOptions, setHazardTypeFilterValue],
  )

  const oscFilters = (
    <>
      {hazardTypeFilterOptions?.length ? (
        <div className={analyticsStyles.filterInputWrapper}>
          <label htmlFor="hazard-type-filter" className={formStyles.formLabel}>
            Hazard Type
          </label>
          <Select.Root
            value={hazardTypeFilterValue}
            onValueChange={setHazardTypeFilterValue}
          >
            <Select.Trigger id="hazard-type-filter" />
            <Select.Content>
              {hazardTypeFilterOptions?.map((option) => (
                <Select.Item value={option} key={option}>
                  {option}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
      ) : null}
      {scenarioFilterOptions?.length ? (
        <div className={analyticsStyles.filterInputWrapper}>
          <label htmlFor="scenario-filter" className={formStyles.formLabel}>
            Scenario
          </label>
          <Select.Root
            value={scenarioFilterValue}
            onValueChange={setScenarioFilterValue}
          >
            <Select.Trigger id="scenario-filter" />
            <Select.Content>
              {scenarioFilterOptions?.map((option) => (
                <Select.Item value={option} key={option}>
                  {option}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
      ) : null}

      {yearFilterOptions?.length ? (
        <div className={analyticsStyles.filterInputWrapper}>
          <label htmlFor="year-filter" className={formStyles.formLabel}>
            Year
          </label>
          <Select.Root
            value={yearFilterValue}
            onValueChange={setYearFilterValue}
          >
            <Select.Trigger id="year-filter" />
            <Select.Content>
              {yearFilterOptions?.map((option) => (
                <Select.Item value={option} key={option}>
                  {option}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
      ) : null}
    </>
  )

  return (
    <>
      <PageLayout>
        <PageTitle>Analysis</PageTitle>
        <PageSubtitle>{`Portfolio: ${uploadedFileName} | Assets: ${userAssets?.features.length}`}</PageSubtitle>
        <RadioGroup.Root
          value={selectedAssetImpactView}
          onValueChange={(value) => {
            setSelectedAssetImpactView(value as AssetImpactViewOptions)

            if (
              value === (AssetImpactViewOptions.DETAILS as string) &&
              !assetToDetailId
            ) {
              toast(
                'Please click "View Details" on an asset to see its details.',
              )
            }
          }}
          name="example"
          className={analyticsStyles.impactsListDetailSelector}
        >
          <RadioGroup.Item value={AssetImpactViewOptions.LIST}>
            Asset List
          </RadioGroup.Item>
          <RadioGroup.Item value={AssetImpactViewOptions.DETAILS}>
            Asset Details
          </RadioGroup.Item>
        </RadioGroup.Root>
        {selectedAssetImpactView === AssetImpactViewOptions.DETAILS &&
        assetToDetailId ? (
          <AssetImpactsDetails
            userAssets={userAssets}
            userAssetsForTable={filteredUserAssetsForTable}
            rowSelection={rowSelection}
            assetToDetailId={assetToDetailId}
            setRowSelection={setRowSelection}
            setAssetToDetailId={setAssetToDetailId}
          />
        ) : (
          <AssetsTable
            areExtraColumnsVisibleInitially={false}
            userAssetsForTable={filteredUserAssetsForTable}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            showSelectBoxes={false}
            showViewDetailsButton={true}
            onViewDetailsClick={(id) => {
              setAssetToDetailId(id)
              setSelectedAssetImpactView(AssetImpactViewOptions.DETAILS)
            }}
            upperRightTitleRowSlot={oscFilters}
          />
        )}
      </PageLayout>
    </>
  )
}
