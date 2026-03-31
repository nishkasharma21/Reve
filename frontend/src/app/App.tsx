import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContexts';
import { router } from './routes';
import { Toaster } from "sonner";

export default function App() {
  return (
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </AuthProvider>
  );
}