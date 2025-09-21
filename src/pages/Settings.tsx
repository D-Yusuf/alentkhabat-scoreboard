import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const isRtl = i18n.dir() === 'rtl';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/score-list" className="p-2">
          {isRtl ? <ArrowRight className="h-6 w-6" /> : <ArrowLeft className="h-6 w-6" />}
        </Link>
        <h1 className="text-2xl font-bold">{t('settings')}</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>
      <Card className="bg-white text-card-foreground">
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
    </div>
  );
};

export default Settings;