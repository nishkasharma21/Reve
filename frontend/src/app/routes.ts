import { createBrowserRouter } from 'react-router';
import { Landing } from './pages/Landing';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Search } from './pages/Search';
import { Post } from './pages/Post';
import { Messages } from './pages/Messages';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Landing,
  },
  {
    path: '/home',
    Component: Home,
  },
  {
    path: '/profile',
    Component: Profile,
  },
  {
    path: '/search',
    Component: Search,
  },
  {
    path: '/post',
    Component: Post,
  },
  {
    path: '/messages',
    Component: Messages,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);