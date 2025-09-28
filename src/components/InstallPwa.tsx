import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import QRCode from 'react-qr-code';
import { useTranslation } from 'react-i18next';

const InstallPwa = () => {
  const [url, setUrl] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    // Ensure this code runs only on the client side
    setUrl(window.location.origin);
  }, []);

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader className="rtl:text-right">
        <CardTitle>{t('install_app')}</CardTitle>
        <CardDescription>{t('install_app_description')}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center p-6">
        {url ? (
          <div style={{ background: 'white', padding: '16px' }}>
            <QRCode value={url} size={128} />
          </div>
        ) : (
          <p>Loading QR Code...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default InstallPwa;