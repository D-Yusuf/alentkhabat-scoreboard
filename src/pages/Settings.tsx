import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Removed useTheme import

const Settings = () => {
  const { t, i18n } = useTranslation();
  // Removed theme and setTheme from useTheme()

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

      {/* Removed Theme selection Card */}
    </div>
  );
};

export default Settings;