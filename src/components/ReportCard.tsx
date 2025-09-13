
import { Report } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  const { id, title, content, createdAt, anonymousId, institution, comments, isCrisisDetected } = report;
  
  return (
    <Card className={`hover:border-whisper-300 transition-colors ${isCrisisDetected ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {title}
          {isCrisisDetected && <Heart className="h-4 w-4 text-red-500" />}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <span className="font-medium">By {anonymousId}</span>
              {institution && (
                <span className="text-whisper-700 text-xs">
                  📍 {institution}
                </span>
              )}
            </div>
            <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
        <Link 
          to={`/report/${id}`} 
          className="text-sm text-whisper-700 hover:underline"
        >
          View details
        </Link>
      </CardFooter>
    </Card>
  );
}
