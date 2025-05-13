
import { Navbar } from "@/components/Navbar";
import { CommentForm } from "@/components/CommentForm";
import { useApp } from "@/context/AppContext";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const { reports, currentUser } = useApp();
  
  const report = reports.find(report => report.id === id);
  
  if (!report) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container px-4 py-8 md:px-6 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
          <p className="text-muted-foreground mb-6">The report you're looking for doesn't exist or has been removed.</p>
          <Button asChild variant="outline">
            <Link to="/reports">Back to Reports</Link>
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
          Back to Reports
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{report.title}</CardTitle>
            <div className="text-sm text-muted-foreground flex justify-between items-center">
              <span>By {report.anonymousId}</span>
              <span>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{report.content}</p>
            
            <Separator className="my-6" />
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Comments ({report.comments.length})</h3>
              
              {currentUser ? (
                <CommentForm reportId={report.id} />
              ) : (
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="mb-2">Please login to comment</p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              )}
              
              <div className="space-y-4 mt-6">
                {report.comments.length > 0 ? (
                  report.comments.map((comment) => (
                    <div key={comment.id} className="bg-muted p-4 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{comment.anonymousId}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <footer className="border-t py-6 bg-muted/50">
        <div className="container px-4 md:px-6 text-center text-sm text-muted-foreground">
          Whisper of Hope © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
