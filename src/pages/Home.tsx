
import { motion, Variants } from 'framer-motion';
import { ParticleNetworkBackground } from "@/components/ParticleNetworkBackground";
import { MainNav } from "@/components/MainNav";
import { HopeSlideshow } from "@/components/HopeSlideshow";
import { Heart, FileText, User, Info, Shield, MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/hooks/use-app";

export default function Home() {
  const { currentUser } = useApp();
  const { t } = useLanguage();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <MainNav />
      <ParticleNetworkBackground darkMode={true} />
      <main className="flex-1 relative z-10">
        <section className="min-h-[80vh] flex items-center justify-center py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center text-center space-y-8"
            >
              <motion.div
                variants={itemVariants}
                className="inline-block p-4 bg-white/10 backdrop-blur-lg rounded-full shadow-xl mb-4 ring-1 ring-white/20"
              >
                <Heart className="h-12 w-12 text-whisper-600" />
              </motion.div>
              <motion.h1
                variants={itemVariants}
                className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl bg-gradient-to-r from-whisper-600 to-whisper-400 text-transparent bg-clip-text"
              >
                {t('whisperOfHope')}
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="mx-auto max-w-[700px] text-lg md:text-xl text-muted-foreground/90 leading-relaxed"
              >
                {t('homeDescription')}
              </motion.p>
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-4 pt-4"
              >
                {currentUser ? (
                  <Button
                    asChild
                    size="lg"
                    className="bg-whisper-600 hover:bg-whisper-700 shadow-lg hover:shadow-xl transition-all duration-300 scale-100 hover:scale-105"
                  >
                    <Link to="/reports">
                      <FileText className="w-5 h-5 mr-2" />
                      {t('viewReports')}
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    className="bg-whisper-600 hover:bg-whisper-700 shadow-lg hover:shadow-xl transition-all duration-300 scale-100 hover:scale-105"
                  >
                    <Link to="/auth">
                      <User className="w-5 h-5 mr-2" />
                      {t('getStarted')}
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-300 scale-100 hover:scale-105"
                >
                  <Link to="/about">
                    <Info className="w-5 h-5 mr-2" />
                    {t('learnMore')}
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Hope & Inspiration Slideshow Section */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-transparent via-whisper-50/50 to-transparent dark:via-whisper-950/30">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
                Words of Hope & Healing
              </h2>
              <p className="text-center text-muted-foreground">
                Take a moment to reflect on messages that support your recovery journey
              </p>
            </motion.div>
            <HopeSlideshow />
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
