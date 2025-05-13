
import { Report } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  const { id, title, content, createdAt, anonymousId, comments } = report;
  
  return (
    <Card className="hover:border-whisper-300 transition-colors">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="text-sm text-muted-foreground flex justify-between items-center">
          <span>By {anonymousId}</span>
          <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
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
