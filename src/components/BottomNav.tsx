import { NavLink } from 'react-router-dom';
import { Users, User, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BottomNav = () => {
  const { t } = useTranslation();
  const activeLinkClass = "text-blue-600";
  const inactiveLinkClass = "text-gray-500";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex justify-around max-w-md mx-auto">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center p-3 ${isActive ? activeLinkClass : inactiveLinkClass}`}>
          <Users size={20} />
          <span className="text-xs mt-1">{t('teams')}</span>
        </NavLink>
        <NavLink to="/players" className={({ isActive }) => `flex flex-col items-center p-3 ${isActive ? activeLinkClass : inactiveLinkClass}`}>
          <User size={20} />
          <span className="text-xs mt-1">{t('players')}</span>
        </NavLink>
        <NavLink to="/score-list" className={({ isActive }) => `flex flex-col items-center p-3 ${isActive ? activeLinkClass : inactiveLinkClass}`}>
          <List size={20} />
          <span className="text-xs mt-1">{t('score_list')}</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;