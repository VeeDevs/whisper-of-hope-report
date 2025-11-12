
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
  const { id, title, content, created_at, anonymous_id, institution, comments, is_crisis_detected } = report;
  
  const { currentUser, addCommentToReport, refreshReports } = useApp();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!currentUser) return;
    type Follow = { followerId: string; followingId: string };
    const follows: Follow[] = JSON.parse(localStorage.getItem('whisper_listen_closely') || '[]');
    setIsFollowing(follows.some((f) => f.followerId === currentUser.id && f.followingId === report.user_id));
  }, [currentUser, report.user_id]);

  const handleFollow = () => {
    if (!currentUser) return;
    setLoadingFollow(true);
    type Follow = { id: string; followerId: string; followingId: string; createdAt: string };
    const follows: Follow[] = JSON.parse(localStorage.getItem('whisper_listen_closely') || '[]');
    if (!follows.some((f) => f.followerId === currentUser.id && f.followingId === report.user_id)) {
      follows.push({
        id: Date.now().toString(),
        followerId: currentUser.id,
        followingId: report.user_id,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('whisper_listen_closely', JSON.stringify(follows));
      setIsFollowing(true);
    }
    setLoadingFollow(false);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addCommentToReport(id, newComment);
      setNewComment('');
      setShowCommentForm(false);
      await refreshReports();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`hover:border-whisper-300 transition-colors ${is_crisis_detected ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {title}
          {is_crisis_detected && <Heart className="h-4 w-4 text-red-500" />}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <span className="font-medium flex items-center gap-2">
                <span>
                  By {`@${anonymous_id}`}
                </span>
                {institution && (
                  <span className="text-whisper-700 text-xs bg-whisper-50 px-2 py-1 rounded-full">
                    📚 {institution}
                  </span>
                )}
              </span>
            </div>
            <span>{formatDistanceToNow(new Date(created_at), { addSuffix: true })}</span>
          </div>
        </div>
        {/* Follow button */}
        {currentUser && report.user_id !== currentUser.id && (
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
          {currentUser && report.user_id !== currentUser.id && (
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
            <DialogTitle>Chat with {`@${anonymous_id}`}</DialogTitle>
          </DialogHeader>
          <div className="flex-1">
            {currentUser && <ChatInterface friendId={report.user_id} />}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
