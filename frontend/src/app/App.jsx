import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import 'sonner/dist/styles.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
        <Toaster />
      </SocketProvider>
    </AuthProvider>


  );
}

export default App;





