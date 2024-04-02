import { ReactNode } from 'react'
import layoutStyles from './Layout.module.css'
import { Text } from '@radix-ui/themes'

export const Layout = ({ map }: { map: ReactNode }) => {
  return (
    <div className={layoutStyles.layoutWrapper}>
      <div className={layoutStyles.hypotheticalSidebar}>
        <Text>A hypothetical side bar</Text>
      </div>
      {map}
    </div>
  )
}
