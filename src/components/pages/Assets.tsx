import { Button, Table, Text } from '@radix-ui/themes'
import { useRef } from 'react'
import { LoadUserAssets } from '../../useUploadedAssets'
import { PageWithMapLayout } from '../Layout/PageWithMapLayout'
import { Map } from '../Map/Map'

export const Assets = ({
  loadUserAssets,
  mapContainer,
}: {
  loadUserAssets: LoadUserAssets
  mapContainer: React.RefObject<HTMLDivElement>
}) => {
  const uploadRef = useRef<HTMLInputElement>(null)
  const sidebarContent = (
    <>
      <Text>A hypothetical side bar</Text>
      {/* <Button onClick={handleLogin}>login demo</Button>
      <Button onClick={handleLogout}>logout demo</Button> */}
      <input
        type="file"
        id="upload-assets"
        hidden
        ref={uploadRef}
        onChange={(event) => loadUserAssets(event)}
        accept=".csv, .geojson"
      />
      <Button onClick={() => uploadRef.current?.click()}>
        Upload GeoJSON or CSV Assets
      </Button>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>AAA</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>BBB</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CCC</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>111</Table.RowHeaderCell>
            <Table.Cell>222</Table.Cell>
            <Table.Cell>333</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.RowHeaderCell>444</Table.RowHeaderCell>
            <Table.Cell>555</Table.Cell>
            <Table.Cell>666</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.RowHeaderCell>777</Table.RowHeaderCell>
            <Table.Cell>888</Table.Cell>
            <Table.Cell>999</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </>
  )

  return (
    <PageWithMapLayout
      map={<Map mapContainer={mapContainer} />}
      sidebarContent={sidebarContent}
      pageName="Assets"
    />
  )
}
