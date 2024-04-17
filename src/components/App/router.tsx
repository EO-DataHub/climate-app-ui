import { Navigate, createBrowserRouter } from 'react-router-dom'
import { Assets } from '../pages/Assets'
import { AppLayout } from '../Layout/AppLayout'
import { NotFound } from '../pages/404'

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
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.VITE_BASE_PATH },
)
