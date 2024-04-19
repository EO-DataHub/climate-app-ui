import { IconButton, Tooltip } from '@radix-ui/themes'
import { NavLink } from 'react-router-dom'

import WarningIcon from '@material-design-icons/svg/outlined/warning_amber.svg?react'
import VisibilityIcon from '@material-design-icons/svg/outlined/visibility.svg?react'
import ApartmentIcon from '@material-design-icons/svg/outlined/apartment.svg?react'
import FolderIcon from '@material-design-icons/svg/outlined/folder.svg?react'
import PersonIcon from '@material-design-icons/svg/outlined/person.svg?react'
import InfoIcon from '@material-design-icons/svg/outlined/info.svg?react'
import UploadIcon from '@material-design-icons/svg/outlined/upload_file.svg?react'
import ArticleIcon from '@material-design-icons/svg/outlined/article.svg?react'
import NotificationsIcon from '@material-design-icons/svg/outlined/notifications.svg?react'

import containerStyles from '../genericStyles/containers.module.css'
import actionBarStyles from './ActionsBar.module.css'

export const ActionsBar = () => {
  return (
    <div
      className={`${actionBarStyles.actionsWrapper} ${containerStyles.flexColumnSpaceBetweenCenter}`}
    >
      <div className="supercali">logo</div>
      <nav
        className={`${containerStyles.flexColumnStartCenter} ${actionBarStyles.nav1}`}
      >
        <Tooltip content="Hazards" side="right">
          <IconButton asChild>
            <NavLink to="/hazards">
              <WarningIcon />
            </NavLink>
          </IconButton>
        </Tooltip>
        <Tooltip content="Observations" side="right">
          <IconButton asChild>
            <NavLink to="/observations">
              <VisibilityIcon />
            </NavLink>
          </IconButton>
        </Tooltip>
        <Tooltip content="Assets" side="right">
          <IconButton asChild>
            <NavLink to="/assets">
              <ApartmentIcon />
            </NavLink>
          </IconButton>
        </Tooltip>
        <Tooltip content="Portfolios" side="right">
          <IconButton asChild>
            <NavLink to="/portfolios">
              <FolderIcon />
            </NavLink>
          </IconButton>
        </Tooltip>
        <Tooltip content="Reports" side="right">
          <IconButton asChild>
            <NavLink to="/reports">
              <ArticleIcon />
            </NavLink>
          </IconButton>
        </Tooltip>
      </nav>
      <div className={containerStyles.flexColumnEndCenter}>
        <Tooltip content="Upload assets" side="right">
          <IconButton>
            <UploadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip content="Notifications" side="right">
          <IconButton>
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
      </div>
      <nav className={containerStyles.flexColumnEndCenter}>
        <Tooltip content="about" side="right">
          <IconButton asChild>
            <NavLink to="/about">
              <InfoIcon />
            </NavLink>
          </IconButton>
        </Tooltip>

        <Tooltip content="Account settings" side="right">
          <IconButton asChild>
            <NavLink to="/account">
              <PersonIcon />
            </NavLink>
          </IconButton>
        </Tooltip>
      </nav>
    </div>
  )
}
