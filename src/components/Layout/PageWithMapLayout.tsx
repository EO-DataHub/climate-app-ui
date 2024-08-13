import { ReactNode } from 'react'

import pageWithMapStyles from './PageWithMapLayout.module.css'
import { PageTitle } from '../PageTitle'
import { PageSubtitle } from '../PageSubtitle'

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
  subtitle?: string | ReactNode
  title: string
  legend?: ReactNode
}) => {
  return (
    <main className={pageWithMapStyles.layoutWrapper}>
      <div
        className={pageWithMapStyles.sidebar}
        style={{ flexBasis: sidebarWidth, maxWidth: sidebarWidth }}
      >
        <div className={pageWithMapStyles.titlesContainer}>
          <PageTitle>{title}</PageTitle>
          {typeof subtitle === 'string' ? (
            <PageSubtitle>{subtitle}</PageSubtitle>
          ) : null}
          {subtitle && typeof subtitle !== 'string' ? subtitle : null}
        </div>

        {sidebarContent}
      </div>
      {map}
      {legend ? <div className={pageWithMapStyles.legend}>{legend}</div> : null}
    </main>
  )
}
