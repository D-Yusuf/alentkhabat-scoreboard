import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { useScore } from '@/context/ScoreContext';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { isPromoBarVisible, setIsPromoBarVisible, isPromoBarTextMoving, setIsPromoBarTextMoving } = useScore();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">{t('settings')}</h1>
      </div>
      
      <Card className="bg-card text-card-foreground">
        <CardHeader className="rtl:text-right">
          <CardTitle>{t('language')}</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card className="bg-card text-card-foreground">
        <CardHeader className="rtl:text-right">
          <CardTitle>{t('theme')}</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card className="bg-card text-card-foreground">
        <CardHeader className="rtl:text-right">
          <CardTitle>{t('promo_bar')}</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card className="bg-card text-card-foreground">
        <CardHeader className="rtl:text-right">
          <CardTitle>{t('promo_bar_animation')}</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;