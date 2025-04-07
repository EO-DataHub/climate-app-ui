import { Outlet } from 'react-router-dom'
import { WorkspaceSelector } from '../WorkspaceSelector'
import appLayoutStyles from './AppLayout.module.scss'
import { ActionsBar } from '../ActionsBar/ActionsBar'
import { ToastContainer } from 'react-toastify'
import '../../styles/WorkspaceSelector.css'

export const AppLayout = () => {
  return (
    <div className={appLayoutStyles.layoutWrapper}>
      <ToastContainer
        autoClose={false}
        theme="colored"
        position="bottom-right"
      />
      <ActionsBar />
      <div className={appLayoutStyles.contentWrapper}>
        <WorkspaceSelector />
        <Outlet />
      </div>
    </div>
  )
}
