
import { Navbar } from "@/components/Navbar";
import { CommentForm } from "@/components/CommentForm";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const { reports, currentUser } = useApp();
  const { t } = useLanguage();
  
  const report = reports.find(report => report.id === id);
  
  if (!report) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container px-4 py-8 md:px-6 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">{t('reportNotFound')}</h1>
          <p className="text-muted-foreground mb-6">{t('reportNotFoundDesc')}</p>
          <Button asChild variant="outline">
            <Link to="/reports">{t('backToReports')}</Link>
          </Button>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-8 md:px-6">
        <Link 
          to="/reports" 
          className="inline-flex items-center text-sm text-whisper-700 hover:underline mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t('backToReports')}
        </Link>
        
        <Card className={report.isCrisisDetected ? 'border-red-200 bg-red-50' : ''}>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              {report.title}
              {report.isCrisisDetected && <Heart className="h-5 w-5 text-red-500" />}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">By {report.anonymousId}</span>
                  {report.institution && (
                    <span className="text-whisper-700 text-xs">
                      📍 {report.institution}
                    </span>
                  )}
                </div>
                <span>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{report.content}</p>
            
            <Separator className="my-6" />
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">{t('comments')} ({report.comments.length})</h3>
              
              {currentUser ? (
                <CommentForm reportId={report.id} />
              ) : (
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="mb-2">{t('pleaseLoginToComment')}</p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/login">{t('login')}</Link>
                  </Button>
                </div>
              )}
              
              <div className="space-y-4 mt-6">
                {report.comments.length > 0 ? (
                  report.comments.map((comment) => (
                    <div key={comment.id} className="bg-muted p-4 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-sm">By {comment.anonymousId}</span>
                          {comment.institution && (
                            <span className="text-whisper-700 text-xs">
                              📍 {comment.institution}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    {t('noCommentsYet')}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <footer className="border-t py-6 bg-muted/50">
        <div className="container px-4 md:px-6 text-center text-sm text-muted-foreground">
          {t('copyright')} {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
