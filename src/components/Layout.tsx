import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="min-h-screen pb-20">
      <main className="p-4 container mx-auto max-w-md">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;