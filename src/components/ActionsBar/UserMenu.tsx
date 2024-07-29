import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import AccountIcon from '@material-design-icons/svg/filled/account_circle.svg?react'
import LoginIcon from '@material-design-icons/svg/filled/login.svg?react'
import LogoutIcon from '@material-design-icons/svg/filled/logout.svg?react'
import SettingsIcon from '@material-design-icons/svg/filled/settings.svg?react'

import userMenuStyles from './UserMenu.module.scss'
import { useContext } from 'react'
import { AuthenticationContext } from '../../context/AuthenticationContext'
import { Link } from 'react-router-dom'
import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator'

export const UserMenu = ({
  isUserMenuOpen,
  setIsUserMenuOpen,
}: {
  isUserMenuOpen: boolean
  setIsUserMenuOpen: (isOpen: boolean) => void
}) => {
  const { isAuthenticated, login, logout, userInfo, isAuthenticating } =
    useContext(AuthenticationContext)
  const firstInitial = userInfo?.given_name?.charAt(0)
  const lastInitial = userInfo?.family_name?.charAt(0)

  const closeMenu = () => {
    setIsUserMenuOpen(false)
  }

  return (
    <DropdownMenu.Root onOpenChange={setIsUserMenuOpen} open={isUserMenuOpen}>
      <DropdownMenu.Trigger>
        <AccountIcon />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        side="right"
        sideOffset={25}
        className={userMenuStyles.dropdownContent}
      >
        {isAuthenticating ? <LoadingIndicator /> : null}
        {!isAuthenticated && !isAuthenticating ? (
          <DropdownMenu.Item onClick={login}>
            <LoginIcon />
            Log in
          </DropdownMenu.Item>
        ) : null}
        {isAuthenticated ? (
          <>
            <div className={userMenuStyles.userInfo}>
              <div className={userMenuStyles.userIcon}>
                {firstInitial}
                {lastInitial}
              </div>
              {userInfo?.name}
            </div>
            <Link to="/settings" role="menuitem" onClick={closeMenu}>
              <SettingsIcon />
              Settings
            </Link>

            <DropdownMenu.Item onClick={logout}>
              <LogoutIcon /> Log out
            </DropdownMenu.Item>
          </>
        ) : null}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
