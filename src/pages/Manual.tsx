    import React from 'react'
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

export default function Manual() {
    const { t } = useTranslation();
  return (
      <NavLink className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#ffd900] border p-4 px-10 rounded-md text-primary font-bold" to="/files/game-manual">
          {t('open_manual')}
      </NavLink>
        
  )
}
