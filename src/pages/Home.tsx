
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import { Shield, MessageCircle, Users } from "lucide-react";

export default function Home() {
  const { currentUser } = useApp();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-gradient-to-br from-whisper-50 to-whisper-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="inline-block p-3 bg-white rounded-full shadow-sm mb-4">
                <Shield className="h-10 w-10 text-whisper-600" />
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-whisper-800">
                {t('whisperOfHope')}
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                {t('homeDescription')}
              </p>
              <div className="space-x-4 pt-4">
                {currentUser ? (
                  <Button asChild size="lg" className="bg-whisper-600 hover:bg-whisper-700">
                    <Link to="/reports">{t('viewReports')}</Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="bg-whisper-600 hover:bg-whisper-700">
                    <Link to="/register">{t('getStarted')}</Link>
                  </Button>
                )}
                <Button asChild variant="outline" size="lg">
                  <Link to="/about">{t('learnMore')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-whisper-100 rounded-full">
                  <Shield className="h-8 w-8 text-whisper-600" />
                </div>
                <h3 className="text-xl font-bold">{t('anonymousReporting')}</h3>
                <p className="text-muted-foreground">
                  {t('anonymousReportingDesc')}
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-whisper-100 rounded-full">
                  <MessageCircle className="h-8 w-8 text-whisper-600" />
                </div>
                <h3 className="text-xl font-bold">{t('communitySupport')}</h3>
                <p className="text-muted-foreground">
                  {t('communitySupportDesc')}
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-whisper-100 rounded-full">
                  <Users className="h-8 w-8 text-whisper-600" />
                </div>
                <h3 className="text-xl font-bold">{t('safeEnvironment')}</h3>
                <p className="text-muted-foreground">
                  {t('safeEnvironmentDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">{t('copyright')} {new Date().getFullYear()}</span>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link to="/terms" className="hover:underline">{t('terms')}</Link>
              <Link to="/privacy" className="hover:underline">{t('privacy')}</Link>
              <Link to="/contact" className="hover:underline">{t('contact')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
