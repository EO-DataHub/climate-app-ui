import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AssetsSpeculativeJunkDrawer } from '../pages/AssetsSpeculativeJunkDrawer'
import { AppLayout } from '../Layout/AppLayout'
import { NotFound } from '../pages/404'
import { Assets } from '../pages/Assets/Assets'
import { Hazards } from '../pages/Hazards/Hazards'
import { AssetsAnalyse } from '../pages/AssetsAnalyse/AssetsAnalyse'
import { Observations } from '../pages/Observations/Observations'

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
          path: '/hazards',
          element: <Hazards />,
        },
        {
          path: '/junk-drawer',
          element: <AssetsSpeculativeJunkDrawer />,
        },
        {
          path: '/analyse-assets',
          element: <AssetsAnalyse />,
        },
        {
          path: '/observations',
          element: <Observations />,
        },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.VITE_BASE_PATH },
)
