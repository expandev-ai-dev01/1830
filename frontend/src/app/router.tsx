import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout } from '@/pages/layouts/RootLayout';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';

const HomePage = lazy(() => import('@/pages/Home'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

// Purchase Pages
const PurchaseListPage = lazy(() => import('@/pages/Purchase/PurchaseList'));
const PurchaseCreatePage = lazy(() => import('@/pages/Purchase/PurchaseCreate'));
const PurchaseEditPage = lazy(() => import('@/pages/Purchase/PurchaseEdit'));
const PurchaseDetailPage = lazy(() => import('@/pages/Purchase/PurchaseDetail'));

/**
 * @router AppRouter
 * @summary Main application routing configuration with lazy loading
 * and hierarchical layouts.
 * @type router-configuration
 * @category navigation
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'purchases',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <PurchaseListPage />
              </Suspense>
            ),
          },
          {
            path: 'new',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <PurchaseCreatePage />
              </Suspense>
            ),
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <PurchaseDetailPage />
              </Suspense>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <PurchaseEditPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

/**
 * @component AppRouter
 * @summary Router provider component that wraps the entire application
 * with routing capabilities.
 */
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
