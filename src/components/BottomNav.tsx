import { NavLink } from 'react-router-dom';
import { Users, User, List } from 'lucide-react';

const BottomNav = () => {
  const activeLinkClass = "text-blue-600";
  const inactiveLinkClass = "text-gray-500";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex justify-around max-w-md mx-auto">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center p-3 ${isActive ? activeLinkClass : inactiveLinkClass}`}>
          <Users size={20} />
          <span className="text-xs mt-1">Teams</span>
        </NavLink>
        <NavLink to="/players" className={({ isActive }) => `flex flex-col items-center p-3 ${isActive ? activeLinkClass : inactiveLinkClass}`}>
          <User size={20} />
          <span className="text-xs mt-1">Players</span>
        </NavLink>
        <NavLink to="/score-list" className={({ isActive }) => `flex flex-col items-center p-3 ${isActive ? activeLinkClass : inactiveLinkClass}`}>
          <List size={20} />
          <span className="text-xs mt-1">Score List</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;