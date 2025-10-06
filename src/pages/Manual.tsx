    import React from 'react'
import { useTranslation } from 'react-i18next';

export default function Manual() {
    const { t } = useTranslation();
  return (
      <a className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#ffd900] border p-4 px-10 rounded-md text-primary font-bold" href="/files/game-manual.pdf" target="_blank" rel="noopener noreferrer">
          {t('open_manual')}
      </a>
        
  )
}
