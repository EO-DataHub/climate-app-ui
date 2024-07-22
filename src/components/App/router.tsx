import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../Layout/AppLayout'
import { NotFound } from '../pages/404'
import { Assets } from '../pages/Assets/Assets'
import { Hazards } from '../pages/Hazards/Hazards'
import { AssetsAnalytics } from '../pages/AssetsAnalytics/AssetsAnalytics'
import { Observations } from '../pages/Observations/Observations'
import { About } from '../pages/About/About'

export const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      children: [
        {
          path: '/',
          element: <About />,
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
          path: '/analytics',
          element: <AssetsAnalytics />,
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
