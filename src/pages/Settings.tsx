import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils'; // Import cn utility

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const isRtl = i18n.dir(i18n.language) === 'rtl';

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
            dir={i18n.dir(i18n.language)}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="en" id="en" className={cn(isRtl && 'order-2')} />
              <Label htmlFor="en" className={cn(isRtl && 'order-1')}>{t('english')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="ar" id="ar" className={cn(isRtl && 'order-2')} />
              <Label htmlFor="ar" className={cn(isRtl && 'order-1')}>{t('arabic')}</Label>
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
            dir={i18n.dir(i18n.language)}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="light" id="light" className={cn(isRtl && 'order-2')} />
              <Label htmlFor="light" className={cn(isRtl && 'order-1')}>{t('light_mode')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="dark" id="dark" className={cn(isRtl && 'order-2')} />
              <Label htmlFor="dark" className={cn(isRtl && 'order-1')}>{t('dark_mode')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="system" id="system" className={cn(isRtl && 'order-2')} />
              <Label htmlFor="system" className={cn(isRtl && 'order-1')}>{t('system_mode')}</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;