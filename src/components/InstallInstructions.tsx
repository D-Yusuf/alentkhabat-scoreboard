import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Share, MoreVertical, Download } from "lucide-react";
import { useEffect, useState } from "react";

interface InstallInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstallInstructions = ({ isOpen, onClose }: InstallInstructionsProps) => {
  const { t } = useTranslation();
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | 'other'>('other');

  useEffect(() => {
    if (isOpen) {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isMobile = /iphone|ipad|ipod|android|webos|blackberry|iemobile|opera mini/.test(userAgent);

      if (/iphone|ipad|ipod/.test(userAgent)) {
        setPlatform('ios');
      } else if (/android/.test(userAgent)) {
        setPlatform('android');
      } else if (!isMobile) {
        setPlatform('desktop');
      } else {
        setPlatform('other');
      }
    }
  }, [isOpen]);

  const getInstructions = () => {
    if (platform === 'ios') {
      return (
        <>
          <p className="mb-4">{t('pwa_install.ios_step1')}</p>
          <div className="flex items-center justify-center">
            <Share className="h-6 w-6 mx-2" />
          </div>
          <p className="mt-4">{t('pwa_install.ios_step2')}</p>
        </>
      );
    }
    if (platform === 'android') {
      return (
        <>
          <p className="mb-4">{t('pwa_install.android_step1')}</p>
          <div className="flex items-center justify-center">
            <MoreVertical className="h-6 w-6 mx-2" />
          </div>
          <p className="mt-4">{t('pwa_install.android_step2')}</p>
        </>
      );
    }
    if (platform === 'desktop') {
      return (
        <>
          <p className="mb-4">{t('pwa_install.desktop_step1')}</p>
          <div className="flex items-center justify-center">
            <Download className="h-6 w-6 mx-2" />
          </div>
          <p className="mt-4">{t('pwa_install.desktop_step2')}</p>
        </>
      );
    }
    return <p>{t('pwa_install.other')}</p>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border-none text-center">
        <DialogHeader className="sm:text-center">
          <DialogTitle className="text-center">{t('pwa_install.title')}</DialogTitle>
          <div className="text-foreground pt-2">
            {getInstructions()}
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={onClose}>{t('pwa_install.close')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstallInstructions;