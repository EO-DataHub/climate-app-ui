import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AssetsSpeculativeJunkDrawer } from '../pages/AssetsSpeculativeJunkDrawer'
import { AppLayout } from '../Layout/AppLayout'
import { NotFound } from '../pages/404'
import { Assets } from '../pages/Assets'

export const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      children: [
        {
          path: '/',
          element: <Navigate to="/assets" />,
        },
        {
          path: '/assets',
          element: <Assets />,
        },
        {
          path: '/junk-drawer',
          element: <AssetsSpeculativeJunkDrawer />,
        },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.VITE_BASE_PATH },
)
