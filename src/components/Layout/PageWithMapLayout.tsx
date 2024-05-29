import { Heading, Text } from '@radix-ui/themes'
import { ReactNode } from 'react'

import pageWithMapStyles from './PageWithMapLayout.module.css'

export const PageWithMapLayout = ({
  map,
  sidebarContent,
  sidebarWidth = '50%',
  subtitle,
  title,
  legend,
}: {
  map: ReactNode
  sidebarContent: ReactNode
  sidebarWidth?: string
  subtitle?: string
  title: string
  legend?: ReactNode
}) => {
  return (
    <main className={pageWithMapStyles.layoutWrapper}>
      <div
        className={pageWithMapStyles.sidebar}
        style={{ flexBasis: sidebarWidth }}
      >
        <div className={pageWithMapStyles.titlesContainer}>
          <Heading as="h1" size="7">
            {title}
          </Heading>
          {subtitle ? <Text size="3">{subtitle}</Text> : null}
        </div>

        {sidebarContent}
      </div>
      {map}
      {legend ? <div className={pageWithMapStyles.legend}>{legend}</div> : null}
    </main>
  )
}
