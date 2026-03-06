import { createBrowserRouter, Navigate } from "react-router-dom";
import { Waitlist } from './pages/Waitlist';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Messages } from './pages/Messages';
import { NotFound } from './pages/NotFound';
import { Browse } from './pages/Browse';
import { ItemDetail } from './pages/ItemDetail';
import { Upload } from './pages/Upload';
import { HowItWorks } from './pages/HowItWorks';
import { Layout } from './Layout';
import { useAuth } from '../contexts/AuthContexts';
import { LoadingSpinner } from './components/LoadingSpinner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
}

// Protected Layout wrapper that includes Navigation
function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/" replace />;

  return <Layout />;
}

export const router = createBrowserRouter([
  // Routes WITHOUT Navigation
  {
    path: '/',
    Component: Waitlist,
  },
  {
    path: '/onboard',
    element: (
      <ProtectedRoute>
        <Onboarding />
      </ProtectedRoute>
    ),
  },
  // Routes WITH Navigation (wrapped by Layout)
  {
    element: <ProtectedLayout />,
    // element: <Layout />,
    children: [
      {
        path: '/home',
        Component: Home,
      },
      {
        path: '/profile',
        Component: Profile,
      },
      {
        path: '/messages/:conversationId?',
        Component: Messages,
      },
      {
        path: '/browse/:category?',
        Component: Browse,
      },
      {
        path: '/items/:id',
        Component: ItemDetail,
      },
      {
        path: '/upload',
        Component: Upload,
      },
      {
        path: '/how-it-works',
        Component: HowItWorks,
      },
      {
        path: '*',
        Component: NotFound,
      },
    ],
  },
]);