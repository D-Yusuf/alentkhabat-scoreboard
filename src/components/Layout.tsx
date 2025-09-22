import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="h-screen bg-background text-foreground">
      <main className="p-4 container mx-auto max-w-md h-full pb-20 box-border flex flex-col">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;