
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
  
  // Follow (listen closely) logic
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const { currentUser } = require("@/context/AppContext").useApp();

  useEffect(() => {
    if (!currentUser) return;
    const follows = JSON.parse(localStorage.getItem('whisper_listen_closely') || '[]');
    setIsFollowing(follows.some((f: any) => f.followerId === currentUser.id && f.followingId === report.userId));
  }, [currentUser, report.userId]);

  const handleFollow = () => {
    if (!currentUser) return;
    setLoadingFollow(true);
    const follows = JSON.parse(localStorage.getItem('whisper_listen_closely') || '[]');
    if (!follows.some((f: any) => f.followerId === currentUser.id && f.followingId === report.userId)) {
      follows.push({
        id: Date.now().toString(),
        followerId: currentUser.id,
        followingId: report.userId,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('whisper_listen_closely', JSON.stringify(follows));
      setIsFollowing(true);
    }
    setLoadingFollow(false);
  };

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
        {/* Follow button */}
        {currentUser && report.userId !== currentUser.id && (
          <button
            className={`mt-2 px-3 py-1 rounded text-xs font-medium border ${isFollowing ? 'bg-green-100 text-green-700 border-green-300' : 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'} transition`}
            onClick={handleFollow}
            disabled={isFollowing || loadingFollow}
          >
            {isFollowing ? 'Following' : loadingFollow ? 'Following...' : 'Follow user'}
          </button>
        )}
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
