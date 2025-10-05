import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import InstallInstructions from './InstallInstructions';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from 'react-i18next';

const PWA_INSTRUCTIONS_SHOWN_KEY = 'pwaInstallInstructionsShown';

const PwaInstallPrompt = () => {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const hasSeenInstructions = localStorage.getItem(PWA_INSTRUCTIONS_SHOWN_KEY);
    if (!hasSeenInstructions) {
      setIsInstructionsOpen(true);
      localStorage.setItem(PWA_INSTRUCTIONS_SHOWN_KEY, 'true');
    }
  }, []);

  return (
    <>
      <div className="fixed bottom-20 right-4 z-50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={() => setIsInstructionsOpen(true)}
            >
              <Info className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('pwa_install.tooltip')}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <InstallInstructions
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />
    </>
  );
};

export default PwaInstallPrompt;