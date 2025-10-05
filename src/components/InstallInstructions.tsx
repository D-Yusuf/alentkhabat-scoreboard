import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Share, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";

interface InstallInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstallInstructions = ({ isOpen, onClose }: InstallInstructionsProps) => {
  const { t } = useTranslation();
  const [os, setOs] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setOs('ios');
    } else if (/android/.test(userAgent)) {
      setOs('android');
    } else {
      setOs('other');
    }
  }, []);

  const getInstructions = () => {
    if (os === 'ios') {
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
    if (os === 'android') {
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
    return <p>{t('pwa_install.other')}</p>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border-none text-center">
        <DialogHeader>
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