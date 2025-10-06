import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTheme } from 'next-themes';
import { useScore } from '@/context/ScoreContext';
import InstallPwa from '@/components/InstallPwa';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import InstallInstructions from '@/components/InstallInstructions';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { 
    isPromoBarVisible, 
    setIsPromoBarVisible, 
    isPromoBarTextMoving, 
    setIsPromoBarTextMoving,
    promoBarAnimationSpeed,
    setPromoBarAnimationSpeed
  } = useScore();
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [showInstallHelpButton, setShowInstallHelpButton] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem('scoreboard_show_install_help_button');
      return v === null ? true : v === 'true';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('scoreboard_show_install_help_button', showInstallHelpButton ? 'true' : 'false');
    } catch {}
  }, [showInstallHelpButton]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-10" /> {/* Placeholder for spacing */}
        <h1 className="text-2xl font-bold">{t('settings')}</h1>
          <button className="text-white border p-4 border-[#ffd900] rounded-lg" onClick={() => setIsInstructionsOpen(true)}>
            {/* <Download className="h-6 w-6" /> */}
            {t('install_app')}
          </button>
      </div>
      
      <Accordion type="multiple" className="bg-card text-card-foreground rounded-lg">
        <AccordionItem value="language">
          <AccordionTrigger className="px-4 rtl:text-right">{t('language')}</AccordionTrigger>
          <AccordionContent>
            <div className="p-4">
              <RadioGroup
                defaultValue={i18n.language}
                onValueChange={changeLanguage}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                  <RadioGroupItem value="en" id="en" />
                  <Label htmlFor="en">{t('english')}</Label>
                </div>
                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                  <RadioGroupItem value="ar" id="ar" />
                  <Label htmlFor="ar">{t('arabic')}</Label>
                </div>
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* <AccordionItem value="install-help">
          <AccordionTrigger className="px-4 rtl:text-right">{t('show_install_button')}</AccordionTrigger>
          <AccordionContent>
            <div className="p-4">
              <RadioGroup
                value={showInstallHelpButton ? 'show' : 'hide'}
                onValueChange={(v) => setShowInstallHelpButton(v === 'show')}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                  <RadioGroupItem value="show" id="show-install-btn" />
                  <Label htmlFor="show-install-btn">{t('show')}</Label>
                </div>
                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                  <RadioGroupItem value="hide" id="hide-install-btn" />
                  <Label htmlFor="hide-install-btn">{t('hide')}</Label>
                </div>
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem> */}

        <AccordionItem value="theme">
          <AccordionTrigger className="px-4 rtl:text-right">{t('theme')}</AccordionTrigger>
          <AccordionContent>
            <div className="p-4">
              <RadioGroup
                defaultValue={theme}
                onValueChange={setTheme}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">{t('light_mode')}</Label>
                </div>
                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">{t('dark_mode')}</Label>
                </div>
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="promo">
          <AccordionTrigger className="px-4 rtl:text-right">{t('promo_bar')}</AccordionTrigger>
          <AccordionContent>
            <div className="p-4">
          <RadioGroup
            value={isPromoBarVisible ? 'show' : 'hide'}
            onValueChange={(value) => setIsPromoBarVisible(value === 'show')}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 rtl:flex-row-reverse">
              <RadioGroupItem value="show" id="show-promo" />
              <Label htmlFor="show-promo">{t('show')}</Label>
            </div>
            <div className="flex items-center gap-2 rtl:flex-row-reverse">
              <RadioGroupItem value="hide" id="hide-promo" />
              <Label htmlFor="hide-promo">{t('hide')}</Label>
            </div>
          </RadioGroup>

          <div className="mt-4 pt-4 border-t">
            <Label className="mb-2 block font-medium">{t('promo_bar_animation')}</Label>
            <RadioGroup
              value={isPromoBarTextMoving ? 'moving' : 'static'}
              onValueChange={(value) => setIsPromoBarTextMoving(value === 'moving')}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 rtl:flex-row-reverse">
                <RadioGroupItem value="static" id="static-promo" />
                <Label htmlFor="static-promo">{t('static')}</Label>
              </div>
              <div className="flex items-center gap-2 rtl:flex-row-reverse">
                <RadioGroupItem value="moving" id="moving-promo" />
                <Label htmlFor="moving-promo">{t('moving')}</Label>
              </div>
            </RadioGroup>
          </div>

          {isPromoBarTextMoving && (
            <div className="mt-4 pt-4 border-t">
              <Label className="mb-2 block font-medium">{t('promo_bar_animation_speed')}</Label>
              <RadioGroup
                value={promoBarAnimationSpeed}
                onValueChange={(value) => setPromoBarAnimationSpeed(value as 'slow' | 'medium' | 'fast')}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                  <RadioGroupItem value="slow" id="slow-promo" />
                  <Label htmlFor="slow-promo">{t('slow')}</Label>
                </div>
                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                  <RadioGroupItem value="medium" id="medium-promo" />
                  <Label htmlFor="medium-promo">{t('medium')}</Label>
                </div>
                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                  <RadioGroupItem value="fast" id="fast-promo" />
                  <Label htmlFor="fast-promo">{t('fast')}</Label>
                </div>
              </RadioGroup>
            </div>
          )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="manual">
          <AccordionTrigger className="px-4 rtl:text-right">{t('manual')}</AccordionTrigger>
          <AccordionContent>
            <div className="p-4">
              <Button className="text-white" variant="outline" onClick={() => window.open('/files/game-manual.pdf', '_blank', 'noopener')}>{t('open_manual')}</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <InstallPwa />

      <InstallInstructions
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />
    </div>
  );
};

export default Settings;