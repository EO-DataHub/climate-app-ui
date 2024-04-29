import { ReactNode } from 'react'
import pageWithMapStyles from './PageWithMapLayout.module.css'
import containerStyles from '../genericStyles/containers.module.css'
import { Heading } from '@radix-ui/themes'

export const PageWithMapLayout = ({
  map,
  pageName,
  sidebarContent,
}: {
  map: ReactNode
  pageName: string
  sidebarContent: ReactNode
}) => {
  return (
    <div className={pageWithMapStyles.layoutWrapper}>
      <div className={pageWithMapStyles.sidebar}>
        <div className={containerStyles.flexRowSpaceBetweenCenter}>
          <Heading as="h2">{pageName}</Heading>
        </div>
        {sidebarContent}
      </div>
      {map}
    </div>
  )
}
