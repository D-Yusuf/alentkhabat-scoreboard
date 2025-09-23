import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <main className="p-4 container mx-auto max-w-md flex-grow pb-20 box-border flex flex-col bg-background">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;