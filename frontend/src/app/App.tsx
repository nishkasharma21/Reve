import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContexts';
import { AccountProvider } from '../contexts/AccountProvider';
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <AccountProvider>
        <RouterProvider router={router} />
      </AccountProvider>
    </AuthProvider>
  );
}