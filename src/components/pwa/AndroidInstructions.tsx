import { useTranslation } from "react-i18next";
import { MoreVertical } from "lucide-react";

const AndroidInstructions = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <p className="mb-4">{t('pwa_install.android_step1')}</p>
      <div className="flex items-center justify-center">
        <MoreVertical className="h-6 w-6 mx-2" />
      </div>
      <p className="mt-4">{t('pwa_install.android_step2')}</p>
    </div>
  );
};

export default AndroidInstructions;



