import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ReportCard } from "@/components/ReportCard";
import { ReportForm } from "@/components/ReportForm";
import { PollForm } from "@/components/PollForm";
import { useApp } from "@/hooks/use-app";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Mousewheel, Pagination } from 'swiper/modules';

export default function Reports() {
  const { reports, currentUser, session } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showReportForm, setShowReportForm] = useState(false);
  const [showPollForm, setShowPollForm] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate('/auth');
    }
  }, [session, navigate]);

  return (
    <div className="h-screen flex flex-col animated-gradient-bg">
      <Navbar />
      <main className="flex-1 relative">
        <Swiper
          direction={'vertical'}
          slidesPerView={1}
          spaceBetween={30}
          mousewheel={true}
          pagination={{
            clickable: true,
          }}
          modules={[Mousewheel, Pagination]}
          className="h-full"
        >
          {reports.length > 0 ? (
            reports.map((report) => (
              <SwiperSlide key={report.id} className="flex items-center justify-center p-4">
                <ReportCard report={report} />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide className="flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">{t('noReportsYet')}</h2>
                <p className="text-muted-foreground mb-6">
                  {t('beFirstToShare')}
                </p>
                {currentUser && (
                  <Button 
                    onClick={() => setShowReportForm(true)}
                    className="bg-whisper-600 hover:bg-whisper-700"
                  >
                    {t('createFirstReport')}
                  </Button>
                )}
              </div>
            </SwiperSlide>
          )}
        </Swiper>

        {currentUser && (
          <div className="absolute bottom-20 right-4 z-10 flex flex-col gap-4">
            <Button 
              onClick={() => setShowReportForm(!showReportForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 h-auto shadow-lg"
            >
              {showReportForm ? t('hide') : t('create')} {t('reports')}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowPollForm(!showPollForm)}
              className="bg-white dark:bg-gray-800 rounded-full p-4 h-auto shadow-lg backdrop-blur-sm"
            >
              {showPollForm ? t('hide') : t('create')} {t('polls')}
            </Button>
          </div>
        )}

        {showReportForm && currentUser && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-20"
              onClick={() => setShowReportForm(false)}
            >
              <div className="bg-card p-8 rounded-lg w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <ReportForm />
              </div>
            </div>
        )}

        {showPollForm && currentUser && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-20"
              onClick={() => setShowPollForm(false)}
            >
              <div className="bg-card p-8 rounded-lg w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <PollForm />
              </div>
            </div>
        )}
      </main>
    </div>
  );
}
