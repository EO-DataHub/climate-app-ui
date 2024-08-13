import { RadioGroup } from '@radix-ui/themes'
import { useState } from 'react'

import { AssetImpactViewOptions } from '../../../configuration/constants'
import { AssetsTable } from '../../AssetsTable/AssetsTable'
import { fakeUnalalyzedUserAssets } from './tempUserAssetsData'
import { PageLayout } from '../../Layout/PageLayout'
import { PageSubtitle } from '../../PageSubtitle'
import { PageTitle } from '../../PageTitle'
import {
  RowSelection,
  UserAssets,
} from '../../../library/userAssets/userAssetTypes'
import analyticsStyles from './AssetsAnalytics.module.scss'
import { AssetImpactsDetails } from './AssetImpactsDetails'
import { toast } from 'react-toastify'

export const AssetsAnalytics = () => {
  const [rowSelection, setRowSelection] = useState<RowSelection>({})
  const [selectedAssetImpactView, setSelectedAssetImpactView] =
    useState<AssetImpactViewOptions>(AssetImpactViewOptions.LIST)

  const [assetToDetailId, setAssetToDetailId] = useState<
    string | number | undefined
  >()
  const userAssets = fakeUnalalyzedUserAssets as unknown as UserAssets
  const assetsToDetailFeature = userAssets?.features.find(
    (feature) => feature.properties.id === assetToDetailId,
  )
  const assetToDetail = assetsToDetailFeature
    ? ({
        type: 'FeatureCollection',
        features: [assetsToDetailFeature],
      } as unknown as UserAssets)
    : undefined

  const uploadedFileName = 'fakeFileName.csv'

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
              !assetToDetail
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
        assetToDetail ? (
          <AssetImpactsDetails
            analysedUserAssets={userAssets}
            rowSelection={rowSelection}
            assetToDetail={assetToDetail}
            setRowSelection={setRowSelection}
            setAssetToDetailId={setAssetToDetailId}
          />
        ) : (
          <AssetsTable
            userAssets={userAssets}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            showPageSelector={false}
            showSearch={false}
            showExtraColumnsToggle={false}
            showSelectBoxes={false}
            showViewDetailsButton={true}
            onViewDetailsClick={(id) => {
              setAssetToDetailId(id)
              setSelectedAssetImpactView(AssetImpactViewOptions.DETAILS)
            }}
          />
        )}
      </PageLayout>
    </>
  )
}
