import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ReportForm } from "@/components/ReportForm";
import { PollForm } from "@/components/PollForm";
import { ReportFeed } from "@/components/ReportFeed";
import { useApp } from "@/hooks/use-app";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Reports() {
  const { currentUser, session, refreshReports, isLoading } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showReportForm, setShowReportForm] = useState(false);
  const [showPollForm, setShowPollForm] = useState(false);

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
    <div className="min-h-screen flex flex-col animated-gradient-bg">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Community Stories</h1>
              <p className="text-slate-600 mt-1">Share your experiences and support others</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowReportForm(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Share Story
              </Button>
            </div>
          </div>

          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reports">Stories</TabsTrigger>
              <TabsTrigger value="polls">Polls</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-6">
              {showReportForm && (
                <div className="sticky top-0 z-50 bg-white p-4 rounded-lg shadow-lg mb-6">
                  <ReportForm />
                  <Button
                    onClick={() => setShowReportForm(false)}
                    variant="ghost"
                    className="mt-2"
                  >
                    Close
                  </Button>
                </div>
              )}
              <ReportFeed />
            </TabsContent>

            <TabsContent value="polls" className="space-y-6">
              {showPollForm && (
                <div className="sticky top-0 z-50 bg-white p-4 rounded-lg shadow-lg mb-6">
                  <PollForm />
                  <Button
                    onClick={() => setShowPollForm(false)}
                    variant="ghost"
                    className="mt-2"
                  >
                    Close
                  </Button>
                </div>
              )}
              <Button
                onClick={() => setShowPollForm(true)}
                variant="outline"
                className="w-full mb-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Poll
              </Button>
              <div className="text-center py-12 bg-slate-50 rounded-lg">
                <p className="text-slate-600">Polls feature coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
