
import { Navbar } from "@/components/Navbar";
import { ReportCard } from "@/components/ReportCard";
import { ReportForm } from "@/components/ReportForm";
import { PollForm } from "@/components/PollForm";
import { PollCard } from "@/components/PollCard";
import { AgeSpecificResources } from "@/components/AgeSpecificResources";
import { StealthMode } from "@/components/StealthMode";
import { CheckInReminder } from "@/components/CheckInReminder";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Reports() {
  const { reports, polls, currentUser, session } = useApp();
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-8 md:px-6">
        {/* Check-in reminder */}
        <div className="mb-6">
          <CheckInReminder />
        </div>

        {/* Stealth mode */}
        <div className="mb-6">
          <StealthMode />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{t('communityHub')}</h1>
                <p className="text-muted-foreground">
                  {t('shareReportsDesc')}
                </p>
              </div>
              {currentUser ? (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowReportForm(!showReportForm)}
                    className="bg-whisper-600 hover:bg-whisper-700"
                  >
                    {showReportForm ? t('hide') : t('create')} {t('reports')}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowPollForm(!showPollForm)}
                  >
                    {showPollForm ? t('hide') : t('create')} {t('polls')}
                  </Button>
                </div>
              ) : (
                <Button asChild variant="outline">
                  <Link to="/login">{t('loginToParticipate')}</Link>
                </Button>
              )}
            </div>

            {/* Forms */}
            {showReportForm && currentUser && (
              <div className="mb-8">
                <ReportForm />
              </div>
            )}

            {showPollForm && currentUser && (
              <div className="mb-8">
                <PollForm />
              </div>
            )}

            {/* Content tabs */}
            <Tabs defaultValue="reports" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reports">{t('reports')} ({reports.length})</TabsTrigger>
                <TabsTrigger value="polls">{t('polls')} ({polls?.length || 0})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reports" className="mt-6">
                {reports.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {reports.map((report) => (
                      <ReportCard key={report.id} report={report} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
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
                )}
              </TabsContent>
              
              <TabsContent value="polls" className="mt-6">
                {polls && polls.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {polls.map((poll) => (
                      <PollCard key={poll.id} poll={poll} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold mb-2">{t('noPolls')}</h2>
                    <p className="text-muted-foreground mb-6">
                      {t('createFirstPoll')}
                    </p>
                    {currentUser && (
                      <Button 
                        variant="outline"
                        onClick={() => setShowPollForm(true)}
                      >
                        {t('createFirstPoll')}
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            <AgeSpecificResources />
          </div>
        </div>
      </main>

      <footer className="border-t py-6 bg-muted/50">
        <div className="container px-4 md:px-6 text-center text-sm text-muted-foreground">
          {t('copyright')} {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
