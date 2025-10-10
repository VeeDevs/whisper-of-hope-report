
import { Button } from "@/components/ui/button";
import { useApp } from "@/hooks/use-app";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";
import { Shield, MessageCircle } from "lucide-react";

export function Navbar() {
  const { currentUser, logout } = useApp();
  const { t } = useLanguage();

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-whisper-700">
          <Shield className="h-6 w-6" />
          <span>{t('whisperOfHope')}</span>
        </Link>
        <nav className="hidden md:flex gap-6 font-medium">
          <Link to="/" className="hover:text-whisper-700 transition-colors">
            {t('home')}
          </Link>
          <Link to="/reports" className="hover:text-whisper-700 transition-colors">
            {t('reports')}
          </Link>
          {currentUser && (
            <Link to="/chat" className="hover:text-whisper-700 transition-colors flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              Chat
            </Link>
          )}
          <Link to="/about" className="hover:text-whisper-700 transition-colors">
            {t('about')}
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LanguageSelector />
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <div>{t('anonymousId')}: <span className="font-medium text-foreground">{currentUser.anonymousId}</span></div>
                {currentUser.institution && (
                  <div className="text-xs text-whisper-700">{currentUser.institution}</div>
                )}
              </div>
              <Button variant="outline" onClick={logout}>
                {t('logout')}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/auth">{t('auth.signIn')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
