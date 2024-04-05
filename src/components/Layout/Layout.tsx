import { ReactNode } from 'react'
import layoutStyles from './Layout.module.css'

export const Layout = ({
  map,
  sidebarContent,
}: {
  map: ReactNode
  sidebarContent: ReactNode
}) => {
  return (
    <div className={layoutStyles.layoutWrapper}>
      <div className={layoutStyles.hypotheticalSidebar}>{sidebarContent}</div>
      {map}
    </div>
  )
}
