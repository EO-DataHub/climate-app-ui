import containerStyles from '../genericStyles/containers.module.css'
import appLayoutStyles from './AppLayout.module.css'
import { NavLink, Outlet } from 'react-router-dom'

export const AppLayout = () => {
  return (
    <div
      className={`${appLayoutStyles.layoutWrapper} ${containerStyles.flexRowSpaceBetweenCenter}`}
    >
      <div
        className={`${appLayoutStyles.navWrapper} ${containerStyles.flexColumnSpaceBetweenCenter}`}
      >
        <div>logo</div>
        <nav
          className={`${containerStyles.flexColumnStartCenter} ${appLayoutStyles.nav1}`}
        >
          <NavLink
            to="/assets"
            className={({ isActive }) =>
              isActive ? appLayoutStyles.navLinkActive : ''
            }
          >
            Assets
          </NavLink>
          <NavLink
            to="/other"
            className={({ isActive }) =>
              isActive ? appLayoutStyles.navLinkActive : ''
            }
          >
            Other
          </NavLink>
        </nav>
        <nav className={containerStyles.flexColumnEndCenter}>
          <NavLink
            to="/xyz"
            className={({ isActive }) =>
              isActive ? appLayoutStyles.navLinkActive : ''
            }
          >
            xyz
          </NavLink>
          <NavLink
            to="/abc"
            className={({ isActive }) =>
              isActive ? appLayoutStyles.navLinkActive : ''
            }
          >
            abc
          </NavLink>
        </nav>
      </div>
      <Outlet />
    </div>
  )
}
