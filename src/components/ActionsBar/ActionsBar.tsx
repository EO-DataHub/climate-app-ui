import { NavLink } from 'react-router-dom'
import AccountIcon from '@material-design-icons/svg/filled/account_circle.svg?react'
import AssetsIcon from '@material-design-icons/svg/filled/category.svg?react'
import HazardsIcon from '@material-design-icons/svg/filled/public.svg?react'
import InformationIcon from '@material-design-icons/svg/filled/info.svg?react'
import NotificationsIcon from '@material-design-icons/svg/filled/notifications.svg?react'
import ObservationsIcon from '@material-design-icons/svg/filled/view_timeline.svg?react'
import PortfolioIcon from '@material-design-icons/svg/filled/folder.svg?react'

import { TooltipForNav } from '../TooltipForNav/TooltipForNav'
import actionBarStyles from './ActionsBar.module.css'
import containerStyles from '../../library/genericStyles/containers.module.css'
import SparkgeoLogo from '../../localAssets/sparkgeo-logo.svg?react'

export const ActionsBar = () => {
  return (
    <div
      className={`${actionBarStyles.actionsWrapper} ${containerStyles.flexColumnSpaceBetweenCenter}`}
    >
      <SparkgeoLogo className={actionBarStyles.logo} />
      <nav
        className={`${containerStyles.flexColumnStartCenter} ${actionBarStyles.nav1}`}
      >
        <TooltipForNav content="Hazards">
          <NavLink to="/hazards">
            <HazardsIcon />
          </NavLink>
        </TooltipForNav>
        <TooltipForNav content="Assets">
          <NavLink to="/assets">
            <AssetsIcon />
          </NavLink>
        </TooltipForNav>
        <TooltipForNav content="Observations">
          <NavLink to="/observations">
            <ObservationsIcon />
          </NavLink>
        </TooltipForNav>

        <TooltipForNav content="Portfolios">
          <NavLink to="/portfolios">
            <PortfolioIcon />
          </NavLink>
        </TooltipForNav>
      </nav>

      <nav className={containerStyles.flexColumnEndCenter}>
        <TooltipForNav content="Notifications">
          <NavLink to="/notifications">
            <NotificationsIcon />
          </NavLink>
        </TooltipForNav>
        <TooltipForNav content="Information">
          <NavLink to="/information">
            <InformationIcon />
          </NavLink>
        </TooltipForNav>
        <TooltipForNav content="Account settings">
          <NavLink to="/account">
            <AccountIcon />
          </NavLink>
        </TooltipForNav>
      </nav>
    </div>
  )
}
