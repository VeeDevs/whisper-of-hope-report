
import { Report } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Users2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { ChatInterface } from "./ChatInterface";
import { useApp } from "@/hooks/use-app";

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  const { id, title, content, createdAt, anonymousId, institution, comments, isCrisisDetected, userType, companyName } = report;
  
  // Follow (listen closely) logic
  const { currentUser, supabase } = useApp();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);

  useEffect(() => {
    if (!currentUser) return;
    type Follow = { followerId: string; followingId: string };
    const follows: Follow[] = JSON.parse(localStorage.getItem('whisper_listen_closely') || '[]');
    setIsFollowing(follows.some((f) => f.followerId === currentUser.id && f.followingId === report.userId));
  }, [currentUser, report.userId]);

  const handleFollow = () => {
    if (!currentUser) return;
    setLoadingFollow(true);
    type Follow = { id: string; followerId: string; followingId: string; createdAt: string };
    const follows: Follow[] = JSON.parse(localStorage.getItem('whisper_listen_closely') || '[]');
    if (!follows.some((f) => f.followerId === currentUser.id && f.followingId === report.userId)) {
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
              <span className="font-medium flex items-center gap-2">
                <span>
                  By {report.isAnonymous ? anonymousId : `@${anonymousId}`}
                  {report.origin && (
                    <span className="text-whisper-500 text-xs ml-1">
                      from {report.origin}
                    </span>
                  )}
                </span>
                {userType === 'student' && institution && (
                  <span className="text-whisper-700 text-xs bg-whisper-50 px-2 py-1 rounded-full">
                    📚 {institution}
                  </span>
                )}
                {userType === 'working' && companyName && (
                  <span className="text-whisper-700 text-xs bg-whisper-50 px-2 py-1 rounded-full">
                    💼 {companyName}
                  </span>
                )}
              </span>
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
        <div className="flex gap-4">
          <span className="text-sm text-muted-foreground">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </span>
          {currentUser && report.userId !== currentUser.id && (
            <button
              onClick={() => setShowChatModal(true)}
              className="text-sm text-whisper-600 hover:text-whisper-700 transition-colors flex items-center gap-1"
            >
              <MessageCircle className="h-4 w-4" />
              Message
            </button>
          )}
        </div>
        <Link 
          to={`/report/${id}`} 
          className="text-sm text-whisper-700 hover:underline"
        >
          View details
        </Link>
      </CardFooter>

      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat with {report.isAnonymous ? anonymousId : `@${anonymousId}`}</DialogTitle>
          </DialogHeader>
          <div className="flex-1">
            {currentUser && <ChatInterface friendId={report.userId} />}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
