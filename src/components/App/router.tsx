import { Navigate, createBrowserRouter } from 'react-router-dom'
import { Assets } from '../pages/Assets'
import { AppLayout } from '../Layout/AppLayout'

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
      ],
    },
  ],
  { basename: import.meta.env.VITE_BASE_PATH },
)
