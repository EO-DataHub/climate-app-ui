import { Navigate, createBrowserRouter } from 'react-router-dom'
import { Assets } from '../pages/Assets'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/assets" />,
    },
    {
      path: '/assets',
      element: <Assets />,
    },
  ],
  { basename: import.meta.env.VITE_BASE_PATH },
)
