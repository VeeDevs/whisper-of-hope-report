import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ReportForm } from "@/components/ReportForm";
import { PollForm } from "@/components/PollForm";
import { ReportFeed } from "@/components/ReportFeed";
import { MotivationalQuotes } from "@/components/MotivationalQuotes";
import { useApp } from "@/hooks/use-app";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Reports() {
  const { currentUser, session, refreshReports, isLoading } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showReportForm, setShowReportForm] = useState(false);
  const [showPollForm, setShowPollForm] = useState(false);
  const [showQuotes, setShowQuotes] = useState(false);

  useEffect(() => {
    if (!isLoading && !session) {
      navigate('/auth');
      return;
    }
    if (session) {
      refreshReports();
    }
  }, [session, isLoading, navigate, refreshReports]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-rose-50 to-amber-50">
      <Navbar />
      <main className="flex-1 w-full px-3 sm:px-4 md:px-6 py-4 md:py-8">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                  Community Stories
                </h1>
                <p className="text-slate-700 mt-2 text-sm md:text-base">
                  Share your experiences and support others in our safe community
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={() => setShowReportForm(true)}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Share Story</span>
                  <span className="sm:hidden">Share</span>
                </Button>
                <Button
                  onClick={() => setShowQuotes(true)}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Inspiration</span>
                  <span className="sm:hidden">Tips</span>
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="reports" className="text-sm md:text-base">Stories</TabsTrigger>
              <TabsTrigger value="polls" className="text-sm md:text-base">Polls</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-4 md:space-y-6">
              {showReportForm && (
                <div className="sticky top-0 z-40 bg-white p-4 md:p-6 rounded-lg shadow-lg mb-4 md:mb-6 border-2 border-purple-200">
                  <ReportForm onSuccess={() => setShowReportForm(false)} />
                  <Button
                    onClick={() => setShowReportForm(false)}
                    variant="outline"
                    className="mt-3 w-full sm:w-auto"
                  >
                    Close
                  </Button>
                </div>
              )}
              <ReportFeed />
            </TabsContent>

            <TabsContent value="polls" className="space-y-4 md:space-y-6">
              {showPollForm && (
                <div className="sticky top-0 z-40 bg-white p-4 md:p-6 rounded-lg shadow-lg mb-4 md:mb-6 border-2 border-blue-200">
                  <PollForm onSuccess={() => setShowPollForm(false)} />
                  <Button
                    onClick={() => setShowPollForm(false)}
                    variant="outline"
                    className="mt-3 w-full sm:w-auto"
                  >
                    Close
                  </Button>
                </div>
              )}
              <Button
                onClick={() => setShowPollForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Poll
              </Button>
              
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Motivational Quotes Modal */}
      {showQuotes && (
        <MotivationalQuotes mode="popup" onClose={() => setShowQuotes(false)} />
      )}
    </div>
  );
}
