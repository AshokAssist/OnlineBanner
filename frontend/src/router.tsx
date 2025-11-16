import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ConfigureBanner } from './pages/ConfigureBanner';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { AdminDashboard } from './pages/AdminDashboard';
import Portfolio from './pages/Portfolio';
import Cart from './pages/Cart';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'portfolio',
        element: <Portfolio />,
      },
      {
        path: 'configure',
        element: (
          <ProtectedRoute>
            <ConfigureBanner />
          </ProtectedRoute>
        ),
      },
      {
        path: 'configure-banner',
        element: (
          <ProtectedRoute>
            <ConfigureBanner />
          </ProtectedRoute>
        ),
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white mb-4">404</h1>
              <p className="text-xl text-gray-300 mb-8">Page not found</p>
              <a href="/" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Go Home
              </a>
            </div>
          </div>
        ),
      },
    ],
  },
]);