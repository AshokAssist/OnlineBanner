import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
// import { DebugUser } from './DebugUser';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
      {/* <DebugUser /> */}
    </div>
  );
};