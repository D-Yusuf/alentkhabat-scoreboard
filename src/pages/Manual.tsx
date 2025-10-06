    import React from 'react'
import { useTranslation } from 'react-i18next';

export default function Manual() {
    const { t } = useTranslation();
  return (
      <a href="/files/game-manual.pdf" target="_blank" rel="noopener noreferrer">
          {t('open_manual')}
      </a>
        
  )
}
