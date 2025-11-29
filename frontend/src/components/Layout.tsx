import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ToastContainer } from './Toast';
import { useToastStore } from '../state/toastStore';

export const Layout: React.FC = () => {
  const { toasts, removeToast } = useToastStore();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};