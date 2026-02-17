import { ReactNode } from 'react';
import { Landing } from './pages/Landing';
import { createBrowserRouter } from "react-router-dom";
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Search } from './pages/Search';
import { Post } from './pages/Post';
import { Messages } from './pages/Messages';
import { NotFound } from './pages/NotFound';
import { Navigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContexts';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
}



export const router = createBrowserRouter([
  {
    path: '/',
    Component: Landing,
  },
  {
    path: '/onboard',
    element: <Onboarding />
    //element: (
      //<ProtectedRoute>
        //<Onboarding />
      //</ProtectedRoute>
    //),
  },
  {
    path: '/home',
    element: <Home />
    //element: (
      //<ProtectedRoute>
        //<Home />
      //</ProtectedRoute>
    //),
  },
  // {
  //   path: '/profile',
  //   Component: Profile,
  // },
  // {
  //   path: '/search',
  //   Component: Search,
  // },
  // {
  //   path: '/post',
  //   Component: Post,
  // },
  // {
  //   path: '/messages',
  //   Component: Messages,
  // },
  // {
  //   path: '*',
  //   Component: NotFound,
  // },
]);