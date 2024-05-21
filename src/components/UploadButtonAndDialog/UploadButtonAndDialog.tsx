import { Button, Dialog, Link, Spinner, Text } from '@radix-ui/themes'
import { useCallback, useContext, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Map as MaplibreMap } from 'maplibre-gl'

import { UserAssetsContext } from '../../context/UserAssetsContext'
import uploadButtonAndDialogStyles from './UploadButtonAndDialog.module.scss'
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'
import { useUpdateUserAssetsInMap } from '../../library/userAssets/useUpdateUserAssetsInMap'

export const UploadButtonAndDialog = ({
  mapRef,
}: {
  mapRef: React.MutableRefObject<MaplibreMap | undefined>
}) => {
  const [chosenUnparsedFiles, setChosenUnparsedFiles] = useState<File[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFileLoading, setIsFileLoading] = useState(false)
  const [isFileParseError, setIsFileParseError] = useState(false)
  const [parsedAssets, setParsedAssets] = useState<FeatureCollection<
    Geometry,
    GeoJsonProperties
  > | null>(null)
  const { parseAssetsIntoGeoJson, setUserAssets } =
    useContext(UserAssetsContext)
  const { updateUserAssetsInMap } = useUpdateUserAssetsInMap({ mapRef })

  const formatAssets = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length < 0) return

      setIsFileParseError(false)
      setIsFileLoading(true)

      parseAssetsIntoGeoJson?.(acceptedFiles?.[0])
        .then((response) => {
          setIsFileLoading(false)

          if (!response?.features.length) {
            setIsFileParseError(true)
          }
          if (response?.features.length) {
            setParsedAssets(response)
          }
        })
        .catch(() => {
          setIsFileParseError(true)
          setIsFileLoading(false)
        })
    },
    [parseAssetsIntoGeoJson],
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setChosenUnparsedFiles(acceptedFiles ?? [])
      formatAssets(acceptedFiles)
    },
    [formatAssets],
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileBrowser,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.geojson'],
    },
    maxFiles: 1,
    noClick: true,
  })

  const handleDialogOpenChange = (isOpen: boolean) => {
    setChosenUnparsedFiles([])
    setParsedAssets(null)
    setIsFileParseError(false)
    setIsDialogOpen(isOpen)
  }

  const handleLoadAssetsClick = () => {
    setUserAssets?.(parsedAssets)
    updateUserAssetsInMap(parsedAssets)
    setIsDialogOpen(false)
  }

  const chosenFile = chosenUnparsedFiles?.[0]
  const dropzoneClassNameToUse = isDragActive
    ? `${uploadButtonAndDialogStyles.dropzone} ${uploadButtonAndDialogStyles.dropzoneActive}`
    : uploadButtonAndDialogStyles.dropzone

  const chosenFileInfo = chosenFile ? (
    <table className={uploadButtonAndDialogStyles.fileDescription}>
      <tbody>
        <tr>
          <td>{chosenFile.name}</td>
          <td>{(chosenFile.size * 0.000001).toFixed(4)} MB</td>
        </tr>
      </tbody>
    </table>
  ) : null

  const assetsFileFinePrint = (
    <Text size="1" className={uploadButtonAndDialogStyles.assetsFileFinePrint}>
      Fine print for file parameters
    </Text>
  )

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <Dialog.Trigger>
        <Link asChild>
          <button>+ Upload File</button>
        </Link>
      </Dialog.Trigger>

      <Dialog.Content className={uploadButtonAndDialogStyles.dialogContent}>
        <Dialog.Title>Upload File</Dialog.Title>
        <Dialog.Description size="2">
          Select a file for analysis
        </Dialog.Description>
        <div
          {...getRootProps({
            className: dropzoneClassNameToUse,
          })}
        >
          <input {...getInputProps()} />

          {isFileLoading ? (
            <>
              <Spinner size="3" />
              <Text weight="bold">Upload in progress</Text>
              {chosenFileInfo}
            </>
          ) : null}
          {!isFileLoading && !parsedAssets ? (
            <Text weight="bold">
              Drag and drop csv or geojson here or
              <br />
              <Link asChild>
                <button onClick={openFileBrowser}>Choose File</button>
              </Link>
            </Text>
          ) : null}
          {parsedAssets && !isFileLoading ? (
            <Text weight="bold">Upload Complete</Text>
          ) : null}
          {assetsFileFinePrint}
          {fileRejections.length > 0 ? (
            <Text className={uploadButtonAndDialogStyles.fileRejectedError}>
              Unsupported file type. Please upload a .csv or .geojson file.
            </Text>
          ) : null}
          {isFileParseError ? (
            <Text className={uploadButtonAndDialogStyles.fileRejectedError}>
              There was an error parsing file. Please review asset formatting
              guidelines and try again.{' '}
            </Text>
          ) : null}
        </div>

        <Button
          className={uploadButtonAndDialogStyles.uploadButton}
          onClick={handleLoadAssetsClick}
          disabled={!parsedAssets}
        >
          Load Assets
        </Button>
      </Dialog.Content>
    </Dialog.Root>
  )
}
