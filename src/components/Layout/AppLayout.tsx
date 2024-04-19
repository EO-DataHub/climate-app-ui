import { Outlet } from 'react-router-dom'

import containerStyles from '../genericStyles/containers.module.css'
import appLayoutStyles from './AppLayout.module.css'
import { ActionsBar } from '../ActionsBar/ActionsBar'

export const AppLayout = () => {
  return (
    <div
      className={`${appLayoutStyles.layoutWrapper} ${containerStyles.flexRowStartCenter}`}
    >
      <ActionsBar />
      <Outlet />
    </div>
  )
}
