import { useEffect, useState } from 'react';
import InstallInstructions from '@/components/InstallInstructions';

const shouldShowKey = 'scoreboard_show_install_prompt';

const AutoInstallPrompt = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const shown = localStorage.getItem(shouldShowKey) || 'false';
      if (shown === 'true') return;

      const ua = window.navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(ua);
      const isAndroid = /android/.test(ua);

      if (isIOS || isAndroid) {
        setOpen(true);
        localStorage.setItem(shouldShowKey, 'true');
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  return (
    <InstallInstructions isOpen={open} onClose={() => setOpen(false)} />
  );
};

export default AutoInstallPrompt;



