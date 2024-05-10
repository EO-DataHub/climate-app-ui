import { Outlet } from 'react-router-dom'

import containerStyles from '../genericStyles/containers.module.css'
import appLayoutStyles from './AppLayout.module.css'
import { ActionsBar } from '../ActionsBar/ActionsBar'
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay'
import { useContext } from 'react'
import { LoadingContext } from '../../context/LoadingContext'

export const AppLayout = () => {
  const { isLoading } = useContext(LoadingContext)

  return (
    <div
      className={`${appLayoutStyles.layoutWrapper} ${containerStyles.flexRowStartCenter}`}
    >
      <ActionsBar />
      <Outlet />
      <LoadingOverlay isVisible={isLoading} />
    </div>
  )
}
