import { useTranslation } from "react-i18next";
import { Share } from "lucide-react";

const IOSInstructions = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <p className="mb-4">{t('pwa_install.ios_step1')}</p>
      <div className="flex items-center justify-center">
        <Share className="h-6 w-6 mx-2" />
      </div>
      <p className="mt-4">{t('pwa_install.ios_step2')}</p>
    </div>
  );
};

export default IOSInstructions;



