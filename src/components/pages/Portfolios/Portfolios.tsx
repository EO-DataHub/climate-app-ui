import AddIcon from '@material-design-icons/svg/filled/add.svg?react'

import { PageTitle } from '../../PageTitle'
import { PageLayout } from '../../Layout/PageLayout'

import portfolioStyles from './Portfolios.module.scss'
import { Button, Spinner } from '@radix-ui/themes'
import { UploadButtonAndDialog } from '../../UploadButtonAndDialog/UploadButtonAndDialog'
import { useContext, useState } from 'react'
import { AuthenticationContext } from '../../../context/AuthenticationContext'
import { UserAssets } from '../../../library/userAssets/userAssetTypes'
import { uploadUserAssets } from '../../../library/api/uploadUserAssets'
import { toast } from 'react-toastify'

export const Portfolios = () => {
  const [isFileUploading, setIsFileUploading] = useState(false)

  const {
    authenticatedAxios,

    workspaceUserName,
  } = useContext(AuthenticationContext)

  const handleLoadAssets = ({
    fileName,
    assets,
  }: {
    fileName: string
    assets: UserAssets
  }) => {
    if (!authenticatedAxios || !workspaceUserName) {
      toast.error('Please log in to upload a file.')
      return
    }
    setIsFileUploading(true)
    uploadUserAssets({
      authenticatedAxios,
      assets,
      fileName,
      workspaceUserName,
    })
      .then(() => {
        toast.success('File uploaded to data hub successfully')
      })
      .catch(() => {
        toast.error('Error uploading file to data hub')
      })
      .finally(() => {
        setIsFileUploading(false)
      })
  }
  return (
    <PageLayout>
      <PageTitle>Portfolios</PageTitle>
      <div className={portfolioStyles.aboveTableRow}>
        <div></div>
        <div>
          <UploadButtonAndDialog
            onLoadAssets={handleLoadAssets}
            trigger={
              <Button className={portfolioStyles.addPortfolioButton}>
                {isFileUploading ? <Spinner /> : <AddIcon />} New Portfolio
              </Button>
            }
            description="Upload a new portfolio of assets"
          />
        </div>
      </div>
    </PageLayout>
  )
}
