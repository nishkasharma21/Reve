import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './ThemeContent';
import { AuthProvider } from '../contexts/AuthContexts';
import { router } from './routes';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}