
import { Report } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Send, Share, MoreVertical, X } from "lucide-react";
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
  
  // Facebook-style reactions
  const [userReaction, setUserReaction] = useState<'like' | 'support' | null>(null);
  const [reactionCounts, setReactionCounts] = useState({ likes: 0, supports: 0, shares: 0 });
  const [visibleComments, setVisibleComments] = useState(3);

  useEffect(() => {
    if (!currentUser) return;
    type Follow = { followerId: string; followingId: string };
    const follows: Follow[] = JSON.parse(localStorage.getItem('whisper_listen_closely') || '[]');
    setIsFollowing(follows.some((f) => f.followerId === currentUser.id && f.followingId === report.user_id));
    
    // Load reaction counts from localStorage
    const reactions = JSON.parse(localStorage.getItem(`report_reactions_${id}`) || '{"likes":0,"supports":0,"shares":0}');
    setReactionCounts(reactions);
    
    // Check user's reaction
    const userReactionKey = `user_reaction_${id}_${currentUser.id}`;
    const savedReaction = localStorage.getItem(userReactionKey) as 'like' | 'support' | null;
    setUserReaction(savedReaction);
  }, [currentUser, report.user_id, id]);

  const handleReaction = (type: 'like' | 'support') => {
    if (!currentUser) return;
    
    const newReactionCounts = { ...reactionCounts };
    const userReactionKey = `user_reaction_${id}_${currentUser.id}`;
    
    // Remove previous reaction
    if (userReaction) {
      newReactionCounts[userReaction]--;
    }
    
    // Add new reaction
    if (userReaction !== type) {
      newReactionCounts[type]++;
      setUserReaction(type);
    } else {
      setUserReaction(null);
    }
    
    setReactionCounts(newReactionCounts);
    localStorage.setItem(`report_reactions_${id}`, JSON.stringify(newReactionCounts));
    localStorage.setItem(userReactionKey, userReaction === type ? '' : type);
  };

  const handleShare = () => {
    const shareText = `Check out this post on Whisper of Hope:\n"${title}"\n\n${content.substring(0, 100)}...`;
    if (navigator.share) {
      navigator.share({ title, text: shareText });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/report/${id}`);
      alert('Report link copied to clipboard!');
    }
    setReactionCounts({ ...reactionCounts, shares: reactionCounts.shares + 1 });
  };

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
    <Card className={`overflow-hidden shadow-md hover:shadow-lg transition-shadow ${is_crisis_detected ? 'border-l-4 border-red-500 bg-red-50/30' : ''}`}>
      {/* Header with Avatar and User Info */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-whisper-500 to-whisper-700 flex items-center justify-center text-white font-bold text-sm">
              {anonymous_id.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">{`@${anonymous_id}`}</span>
                {institution && (
                  <span className="text-whisper-700 text-xs bg-whisper-100 px-2 py-0.5 rounded-full">
                    📚 {institution}
                  </span>
                )}
                {is_crisis_detected && (
                  <span className="text-red-700 text-xs bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Heart className="h-3 w-3" /> Crisis Support
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
            <MoreVertical className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </CardHeader>

      {/* Post Content */}
      <CardContent className="pb-4">
        <Link to={`/report/${id}`} className="hover:opacity-80 transition">
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{content}</p>
        </Link>
      </CardContent>

      {/* Reaction Stats */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between text-sm text-muted-foreground">
        <div className="flex gap-4">
          {reactionCounts.likes > 0 && (
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              {reactionCounts.likes}
            </span>
          )}
          {reactionCounts.supports > 0 && (
            <span className="flex items-center gap-1">
              <Send className="h-4 w-4 fill-whisper-500 text-whisper-500" />
              {reactionCounts.supports}
            </span>
          )}
        </div>
        <span>{comments?.length || 0} Comments • {reactionCounts.shares} Shares</span>
      </div>

      {/* Reaction & Action Buttons */}
      <div className="px-4 py-2 flex gap-1 border-b border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 justify-center gap-2 ${userReaction === 'like' ? 'text-red-500' : 'text-muted-foreground'}`}
          onClick={() => handleReaction('like')}
        >
          <Heart className={`h-5 w-5 ${userReaction === 'like' ? 'fill-red-500' : ''}`} />
          <span className="hidden sm:inline text-sm">Like</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 justify-center gap-2 ${userReaction === 'support' ? 'text-whisper-500' : 'text-muted-foreground'}`}
          onClick={() => handleReaction('support')}
        >
          <Send className={`h-5 w-5 ${userReaction === 'support' ? 'fill-whisper-500' : ''}`} />
          <span className="hidden sm:inline text-sm">Support</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 justify-center gap-2 text-muted-foreground hover:text-blue-500"
          onClick={() => setShowCommentForm(!showCommentForm)}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline text-sm">Comment</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 justify-center gap-2 text-muted-foreground hover:text-green-500"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5" />
          <span className="hidden sm:inline text-sm">Share</span>
        </Button>
      </div>

      {/* Comments Section */}
      {comments && comments.length > 0 && (
        <div className="px-4 py-3 space-y-3 max-h-64 overflow-y-auto">
          {comments.slice(0, visibleComments).map((comment, idx) => (
            <div key={idx} className="flex gap-2 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {comment.anonymous_id?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {comment.anonymous_id || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    {comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) : ''}
                </p>
              </div>
            </div>
          ))}
          {comments.length > visibleComments && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-whisper-600"
              onClick={() => setVisibleComments(visibleComments + 3)}
            >
              View more comments
            </Button>
          )}
        </div>
      )}

      {/* Comment Input Form */}
      {showCommentForm && currentUser && (
        <form onSubmit={handleCommentSubmit} className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-whisper-400 to-whisper-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {currentUser.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a supportive comment..."
                className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm outline-none focus:bg-gray-200 dark:focus:bg-gray-700 transition"
              />
              <Button
                size="sm"
                className="bg-whisper-600 hover:bg-whisper-700"
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setShowCommentForm(false)}
          >
            Cancel
          </Button>
        </form>
      )}

      {/* Chat Modal */}
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
