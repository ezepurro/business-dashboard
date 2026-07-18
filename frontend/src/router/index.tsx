import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { RequireAuth } from './RequireAuth';
import { GuestOnly } from './GuestOnly';
import { ROUTES } from '../constants/routes';
import { LandingPage } from '../pages/home/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { CompaniesPage } from '../pages/companies/CompaniesPage';
import { CompanyDetailPage } from '../pages/companies/CompanyDetailPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.home, element: <LandingPage /> },
      {
        element: <GuestOnly />,
        children: [
          { path: ROUTES.login, element: <LoginPage /> },
          { path: ROUTES.register, element: <RegisterPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: ROUTES.companies, element: <CompaniesPage /> },
          { path: '/companies/:companyId', element: <CompanyDetailPage /> },
        ],
      },
    ],
  },
]);
