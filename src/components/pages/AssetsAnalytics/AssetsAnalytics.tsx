import { useState } from 'react'

import { AssetsTable } from '../../AssetsTable/AssetsTable'
import { fakeUnalalyzedUserAssets } from './tempUserAssetsData'
import { PageLayout } from '../../Layout/PageLayout'
import { PageSubtitle } from '../../PageSubtitle'
import { PageTitle } from '../../PageTitle'
import { RowSelection } from '../../../library/userAssets/userAssetTypes'

export const AssetsAnalytics = () => {
  const [rowSelection, setRowSelection] = useState<RowSelection>({})

  const userAssets = fakeUnalalyzedUserAssets
  const uploadedFileName = 'fakeFileName.csv'

  return (
    <>
      <PageLayout>
        <PageTitle>Analysis</PageTitle>
        <PageSubtitle>{`Portfolio: ${uploadedFileName} | Assets: ${userAssets?.features.length}`}</PageSubtitle>
        <AssetsTable
          // @ts-expect-error temp fake data
          userAssets={userAssets}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </PageLayout>
    </>
  )
}
