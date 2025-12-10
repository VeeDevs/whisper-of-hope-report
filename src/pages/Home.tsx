
import { motion, Variants } from 'framer-motion';
import { ParticleNetworkBackground } from "@/components/ParticleNetworkBackground";
import { MainNav } from "@/components/MainNav";
import { HopeSlideshow } from "@/components/HopeSlideshow";
import { MotivationalQuotes } from "@/components/MotivationalQuotes";
import { Heart, FileText, User, Info, Shield, MessageCircle, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/hooks/use-app";
import { useEffect, useState } from 'react';

export default function Home() {
  const { currentUser } = useApp();
  const { t } = useLanguage();
  const [showQuotes, setShowQuotes] = useState(false);
  const [qod, setQod] = useState<{ text: string; author: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    try {
      const raw = localStorage.getItem('wof_qod');
      if (raw) {
        const cached = JSON.parse(raw) as { text: string; author: string; date: string };
        const today = new Date().toISOString().slice(0, 10);
        if (cached.date === today) {
          setQod({ text: cached.text, author: cached.author });
          cancelled = true;
        }
      }
    } catch (_) { void 0 }
    const fetchQOD = async () => {
      try {
        // Try ZenQuotes Quote of the Day
        const res = await fetch('https://zenquotes.io/api/today');
        if (res.ok) {
          const data = await res.json();
          const item = Array.isArray(data) ? data[0] : data;
          if (!cancelled && item?.q) {
            setQod({ text: item.q, author: item.a || 'Unknown' });
            try {
              const today = new Date().toISOString().slice(0, 10);
              localStorage.setItem('wof_qod', JSON.stringify({ text: item.q, author: item.a || 'Unknown', date: today }));
            } catch (_) { void 0 }
          }
          return;
        }
      } catch (_err) { void 0 }
      try {
        // Fallback: Quotable inspirational random
        const res2 = await fetch('https://api.quotable.io/random?tags=inspirational');
        if (res2.ok) {
          const data2 = await res2.json();
          if (!cancelled && data2?.content) {
            setQod({ text: data2.content, author: data2.author || 'Unknown' });
            try {
              const today = new Date().toISOString().slice(0, 10);
              localStorage.setItem('wof_qod', JSON.stringify({ text: data2.content, author: data2.author || 'Unknown', date: today }));
            } catch (_) { void 0 }
          }
        }
      } catch (_err) { void 0 }
    };
    fetchQOD();
    return () => { cancelled = true; };
  }, []);

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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <MainNav />
      <ParticleNetworkBackground darkMode={false} />
      <main className="flex-1 relative z-10">
        <section className="min-h-[70vh] md:min-h-[80vh] flex items-center justify-center py-8 md:py-12">
          <div className="container px-3 sm:px-4 md:px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center text-center space-y-6 md:space-y-8"
            >
              <motion.div
                variants={itemVariants}
                className="inline-block p-3 md:p-4 bg-white/10 backdrop-blur-lg rounded-full shadow-xl ring-1 ring-white/20"
              >
                <Heart className="h-10 w-10 md:h-12 md:w-12 text-purple-600" />
              </motion.div>
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-transparent bg-clip-text"
              >
                {t('whisperOfHope') || 'Whisper of Hope'}
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="mx-auto max-w-[700px] text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed px-2"
              >
                {t('homeDescription') || 'A safe, supportive community for mental health awareness, recovery, and healing from trauma and abuse.'}
              </motion.p>
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 pt-2 md:pt-4 w-full sm:w-auto"
              >
                {currentUser ? (
                  <>
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                    >
                      <Link to="/reports" className="flex items-center justify-center">
                        <FileText className="w-5 h-5 mr-2" />
                        {t('viewReports') || 'View Stories'}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                    >
                      <Link to="/chat" className="flex items-center justify-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Get Support
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                  >
                    <Link to="/auth" className="flex items-center justify-center">
                      <User className="w-5 h-5 mr-2" />
                      {t('getStarted') || 'Get Started'}
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="backdrop-blur-sm bg-white/50 hover:bg-white/70 transition-all duration-300 w-full sm:w-auto"
                >
                  <Link to="/about" className="flex items-center justify-center">
                    <Info className="w-5 h-5 mr-2" />
                    {t('learnMore') || 'Learn More'}
                  </Link>
                </Button>
              </motion.div>

              {/* Motivational Quote CTA */}
              <motion.div variants={itemVariants} className="pt-4 md:pt-6">
                <Button
                  onClick={() => setShowQuotes(true)}
                  variant="ghost"
                  className="group hover:bg-purple-50 text-purple-600 font-semibold"
                >
                  <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Read Inspiring Quotes
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Quote of the Day */}
        {qod && (
          <section className="py-6">
            <div className="container px-3 sm:px-4 md:px-6">
              <div className="rounded-xl bg-gradient-to-r from-amber-50 via-yellow-50 to-rose-50 border border-amber-200 p-4 md:p-6 shadow-sm">
                <div className="text-center">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">Quote of the Day</h2>
                  <p className="text-base md:text-lg text-slate-700 italic">“{qod.text}”</p>
                  <p className="text-sm text-slate-600 mt-2">— {qod.author}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Hope & Inspiration Slideshow Section */}
        <section className="py-8 md:py-16 bg-gradient-to-b from-transparent via-purple-50/50 to-transparent">
          <div className="container px-3 sm:px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2">
                Words of Hope & Healing
              </h2>
              <p className="text-center text-slate-600 text-sm md:text-base">
                Take a moment to reflect on messages that support your recovery journey
              </p>
            </motion.div>
            <HopeSlideshow />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-8 md:py-16">
          <div className="container px-3 sm:px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid gap-6 md:gap-8 md:grid-cols-3"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center space-y-3 p-4 md:p-6 rounded-lg bg-white/50 backdrop-blur hover:shadow-lg transition-shadow"
              >
                <div className="p-3 bg-purple-100 rounded-full">
                  <Shield className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">{t('anonymousReporting') || 'Anonymous Sharing'}</h3>
                <p className="text-sm md:text-base text-slate-600">
                  {t('anonymousReportingDesc') || 'Share your story safely without revealing your identity'}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center space-y-3 p-4 md:p-6 rounded-lg bg-white/50 backdrop-blur hover:shadow-lg transition-shadow"
              >
                <div className="p-3 bg-blue-100 rounded-full">
                  <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">{t('communitySupport') || 'Community Support'}</h3>
                <p className="text-sm md:text-base text-slate-600">
                  {t('communitySupportDesc') || 'Connect with others and build a supportive network'}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center space-y-3 p-4 md:p-6 rounded-lg bg-white/50 backdrop-blur hover:shadow-lg transition-shadow"
              >
                <div className="p-3 bg-pink-100 rounded-full">
                  <Users className="h-6 w-6 md:h-8 md:w-8 text-pink-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">{t('safeEnvironment') || 'Safe & Secure'}</h3>
                <p className="text-sm md:text-base text-slate-600">
                  {t('safeEnvironmentDesc') || 'A secure space designed with your safety and privacy in mind'}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* AI Support Section */}
        <section className="py-8 md:py-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
          <div className="container px-3 sm:px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <Heart className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Professional Mental Health Support</h2>
              <p className="max-w-2xl text-sm md:text-base text-slate-600">
                Our AI-powered therapist provides compassionate, professional guidance for stress, anxiety, grief, trauma, and emotional balance. Available 24/7, completely confidential.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 mt-4"
              >
                <Link to="/chat">Access AI Therapist</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Motivational Quotes Modal */}
      {showQuotes && (
        <MotivationalQuotes mode="popup" onClose={() => setShowQuotes(false)} />
      )}

      <footer className="border-t py-4 md:py-6 bg-muted/50">
        <div className="container px-3 sm:px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-3 md:gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 md:h-5 md:w-5" />
              <span className="font-medium">{t('copyright') || '©'} {new Date().getFullYear()} Whisper of Hope</span>
            </div>
            <div className="flex gap-3 md:gap-4 text-slate-600 flex-wrap justify-center">
              <Link to="/terms" className="hover:text-slate-900 hover:underline">{t('terms') || 'Terms'}</Link>
              <Link to="/privacy" className="hover:text-slate-900 hover:underline">{t('privacy') || 'Privacy'}</Link>
              <Link to="/contact" className="hover:text-slate-900 hover:underline">{t('contact') || 'Contact'}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
