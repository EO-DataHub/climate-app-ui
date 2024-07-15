import { Outlet } from 'react-router-dom'

import appLayoutStyles from './AppLayout.module.scss'
import { ActionsBar } from '../ActionsBar/ActionsBar'
import { LoadingOverlay } from '../LoadingOverlay/LoadingOverlay'
import { useContext } from 'react'
import { LoadingContext } from '../../context/LoadingContext'
import { ToastContainer } from 'react-toastify'

export const AppLayout = () => {
  const { isLoading } = useContext(LoadingContext)

  return (
    <div className={appLayoutStyles.layoutWrapper}>
      <ToastContainer autoClose={false} theme="colored" />
      <ActionsBar />
      <Outlet />
      <LoadingOverlay isVisible={isLoading} />
    </div>
  )
}
