import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/hooks/use-app";
import { useLanguage } from "@/context/LanguageContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  Home,
  FileText,
  MessageCircle,
  Users,
  Heart,
  Info,
  Mail,
  LogOut,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, session, logout } = useApp();
  const { t } = useLanguage();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "home", path: "/" },
    { icon: FileText, label: "reports", path: "/reports" },
    { icon: MessageCircle, label: "chat", path: "/chat" },
    { icon: Users, label: "groups", path: "/groups" },
    { icon: Info, label: "about", path: "/about" },
    { icon: Mail, label: "contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const menuVariants = {
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader className="mb-4">
              <SheetTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-whisper-600" />
                {t("whisperOfHope")}
              </SheetTitle>
            </SheetHeader>
            <motion.nav
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="flex flex-col gap-2"
            >
              {menuItems.map((item) => (
                <motion.div key={item.path} variants={itemVariants}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                      ${
                        isActive(item.path)
                          ? "bg-whisper-100 text-whisper-900"
                          : "hover:bg-muted"
                      }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {t(item.label)}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between mb-4">
                <ThemeToggle />
                <LanguageSelector />
              </div>
              {currentUser && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${currentUser.username}`} />
                      <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{currentUser.username}</span>
                      <span className="text-xs text-muted-foreground">{currentUser.institution}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <Link to="/" className="flex items-center gap-2 mr-6">
          <Heart className="h-5 w-5 text-whisper-600" />
          <span className="hidden font-bold sm:inline-block">{t("whisperOfHope")}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 mx-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors
                ${
                  isActive(item.path)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <item.icon className="h-4 w-4" />
              {t(item.label)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center ml-auto gap-4">
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <LanguageSelector />
          </div>
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:inline-block text-sm">{currentUser.username}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button asChild className="bg-whisper-600 hover:bg-whisper-700">
              <Link to="/auth">{t("signIn")}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}