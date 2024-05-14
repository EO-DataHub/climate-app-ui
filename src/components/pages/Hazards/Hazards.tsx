import { Button } from '@radix-ui/themes'
import { Map } from '../../Map/Map'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { useMap } from '../../Map/useMap'
import containerStyles from '../../genericStyles/containers.module.css'
import hazardsStyles from './Hazards.module.css'
import { useNavigate } from 'react-router-dom'

export const Hazards = () => {
  const { mapContainer } = useMap()
  const navigate = useNavigate()

  const handleSelectAssetsClick = () => {
    navigate('/assets')
  }

  const sidebarContent = (
    <div
      className={`${containerStyles.flexColumnSpaceBetweenStart} ${hazardsStyles.sidebarContent}`}
    >
      <div></div>
      <Button
        className={hazardsStyles.selectAssetsButton}
        onClick={handleSelectAssetsClick}
      >
        Select Assets for Analysis
      </Button>
    </div>
  )

  const legend = <> Legend Placeholder</>

  return (
    <PageWithMapLayout
      map={<Map mapContainer={mapContainer} />}
      sidebarContent={sidebarContent}
      title="Hazards"
      subtitle="Explore hazard scenarios or analyze assets."
      sidebarWidth="421px"
      legend={legend}
    />
  )
}
