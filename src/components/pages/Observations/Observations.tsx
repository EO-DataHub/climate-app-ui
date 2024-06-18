import { useNavigate } from 'react-router-dom'

import { AssetsSelect } from '../../AssetsSelect'
import { Button, Heading, Select, Separator, Text } from '@radix-ui/themes'
import { InputLabelContainer } from '../../Form/InputLabelContainer'
import { Map } from '../../Map/Map'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { useMap } from '../../Map/useMap'
import { useAssetPortfolios } from '../../../library/userAssets/useAssetPortfolios'
import observationsStyles from './Observations.module.scss'

export const Observations = () => {
  const { mapContainer, mapRef, isMapLoaded } = useMap()
  const { updateCurrentPortfolioShown } = useAssetPortfolios({
    mapRef,
    isMapLoaded,
  })
  const navigate = useNavigate()

  const handleSelectAssetsClick = () => {
    navigate('/assets')
  }

  const sidebarContent = (
    <div className={observationsStyles.sidebarContent}>
      <div className={observationsStyles.sidepanelMidSection}>
        <form className={observationsStyles.observationsForm}>
          <InputLabelContainer>
            <label htmlFor="filter-1">Filter 1</label>
            <Select.Root>
              <Select.Trigger placeholder="Select" />
              <Select.Content id="filter-1">
                <Select.Item value="x">Value 1</Select.Item>
                <Select.Item value="y">Value 2</Select.Item>
                <Select.Item value="z">Value 3</Select.Item>
              </Select.Content>
            </Select.Root>
          </InputLabelContainer>
          <InputLabelContainer>
            <label htmlFor="filter-2">Filter 2</label>
            <Select.Root>
              <Select.Trigger placeholder="Select" />
              <Select.Content id="filter-2">
                <Select.Item value="x">Value 1</Select.Item>
                <Select.Item value="y">Value 2</Select.Item>
                <Select.Item value="z">Value 3</Select.Item>
              </Select.Content>
            </Select.Root>
          </InputLabelContainer>

          <div className={observationsStyles.multiInputRow}>
            <InputLabelContainer>
              <label htmlFor="filter-3">Filter 3</label>
              <Select.Root>
                <Select.Trigger placeholder="Select" />
                <Select.Content id="filter-3">
                  <Select.Item value="x">Value 1</Select.Item>
                  <Select.Item value="y">Value 2</Select.Item>
                  <Select.Item value="z">Value 3</Select.Item>
                </Select.Content>
              </Select.Root>
            </InputLabelContainer>
            <InputLabelContainer>
              <label htmlFor="filter-4">Filter 4</label>
              <Select.Root>
                <Select.Trigger placeholder="Select" />
                <Select.Content id="filter-4">
                  <Select.Item value="x">Value 1</Select.Item>
                  <Select.Item value="y">Value 2</Select.Item>
                  <Select.Item value="z">Value 3</Select.Item>
                </Select.Content>
              </Select.Root>
            </InputLabelContainer>
            <InputLabelContainer>
              <label htmlFor="filter-5">Filter 5</label>
              <Select.Root>
                <Select.Trigger placeholder="Select" />
                <Select.Content id="filter-5">
                  <Select.Item value="x">Value 1</Select.Item>
                  <Select.Item value="y">Value 2</Select.Item>
                  <Select.Item value="z">Value 3</Select.Item>
                </Select.Content>
              </Select.Root>
            </InputLabelContainer>
          </div>
        </form>
        <Separator size="4" />
        <div className={observationsStyles.portfolioSelectWrapper}>
          <Text size="3" weight="bold">
            View Assets on Map
          </Text>
          <InputLabelContainer>
            <label htmlFor="year">Portfolios</label>
            <AssetsSelect
              showUnsaved
              onValueChange={updateCurrentPortfolioShown}
            />
          </InputLabelContainer>
        </div>
        <div style={{ width: '100%' }}>
          <Heading as="h2" size="5">
            Heading Here
          </Heading>
          <Text size="3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
          <div className={observationsStyles.greyBox}></div>
        </div>
      </div>

      <Button
        className={observationsStyles.selectAssetsButton}
        onClick={handleSelectAssetsClick}
      >
        Select Assets for Analysis
      </Button>
    </div>
  )

  const legend = <>Legend Placeholder</>

  return (
    <PageWithMapLayout
      map={<Map mapContainer={mapContainer} />}
      sidebarContent={sidebarContent}
      title="Observations"
      subtitle="Lorem ipsum dolor sit amet, consectetur elit."
      sidebarWidth="542px"
      legend={legend}
    />
  )
}
