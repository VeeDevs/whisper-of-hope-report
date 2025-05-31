
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="inline-block p-3 bg-whisper-100 rounded-full mb-2">
          <Shield className="h-12 w-12 text-whisper-600" />
        </div>
        <h1 className="text-4xl font-bold text-whisper-800">404</h1>
        <h2 className="text-2xl font-semibold">{t('pageNotFound')}</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {t('pageNotFoundDesc')}
        </p>
        <Button asChild className="mt-4">
          <Link to="/">{t('returnHome')}</Link>
        </Button>
      </div>
    </div>
  );
}
