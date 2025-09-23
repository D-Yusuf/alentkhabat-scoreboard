import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import RoundNavigationControls from './RoundNavigationControls';
import { useScore } from '@/context/ScoreContext';

const Layout = () => {
  const location = useLocation();
  const { currentRound, setCurrentRound, numRounds } = useScore();

  const isPlayersPage = location.pathname === '/players';

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <main className="p-4 container mx-auto max-w-md flex-grow pb-20 box-border flex flex-col bg-background">
        <Outlet />
      </main>
      {isPlayersPage && (
        <RoundNavigationControls
          currentRound={currentRound}
          setCurrentRound={setCurrentRound}
          numRounds={numRounds}
        />
      )}
      <BottomNav />
    </div>
  );
};

export default Layout;