import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/use-app';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Share,
  MoreVertical,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ReportWithDetails {
  id: string;
  user_id: string;
  title: string;
  content: string;
  anonymous_id: string;
  created_at: string;
  comments?: any[];
  likes?: number;
  shares?: number;
  userLiked?: boolean;
}

export const ReportFeed: React.FC = () => {
  const { reports, createReport, addCommentToReport } = useApp();
  const [displayReports, setDisplayReports] = useState<ReportWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [likedReports, setLikedReports] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Transform and sort reports
    const sortedReports = (reports || [])
      .map((report: any) => ({
        ...report,
        likes: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 10),
        userLiked: false,
      }))
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setDisplayReports(sortedReports);
  }, [reports]);

  const handleLike = (reportId: string) => {
    if (likedReports.has(reportId)) {
      likedReports.delete(reportId);
    } else {
      likedReports.add(reportId);
      // Trigger confetti effect for dopamine reward
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    setLikedReports(new Set(likedReports));
  };

  const handleComment = async (reportId: string) => {
    const text = commentText[reportId];
    if (!text?.trim()) return;

    setLoading(true);
    try {
      await addCommentToReport(reportId, text);
      setCommentText({ ...commentText, [reportId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (report: ReportWithDetails) => {
    const shareText = `${report.title}\n\n${report.content}\n\nShared from Whisper of Hope`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Whisper of Hope Report',
          text: shareText,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
    }
  };

  const shareToSocialMedia = (report: ReportWithDetails, platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp') => {
    const shareText = `${report.title}\n\n${report.content}`;
    const encodedText = encodeURIComponent(shareText);
    const currentUrl = window.location.href;

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${currentUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
    };

    window.open(urls[platform], '_blank');
  };

  return (
    <div className="space-y-6 pb-20">
      {displayReports.length === 0 ? (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
          <CardContent className="pt-12 text-center">
            <div className="space-y-4">
              <div className="text-6xl">📝</div>
              <h3 className="text-2xl font-bold text-slate-800">No reports yet</h3>
              <p className="text-slate-600">Be the first to share your story and help others in the community.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        displayReports.map((report) => (
          <Card key={report.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{report.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {report.anonymous_id} • {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    <DropdownMenuItem>Mute</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="pt-4 pb-4">
              <p className="text-slate-700 leading-relaxed">{report.content}</p>
              
              {report.comments && report.comments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{report.comments.length} comments</p>
                  {report.comments.slice(0, 2).map((comment: any) => (
                    <div key={comment.id} className="bg-slate-50 p-2 rounded text-sm">
                      <p className="font-medium text-slate-900">{comment.anonymous_id}</p>
                      <p className="text-slate-700">{comment.content}</p>
                    </div>
                  ))}
                  {report.comments.length > 2 && (
                    <button className="text-sm text-blue-600 font-medium hover:underline">
                      View all {report.comments.length} comments
                    </button>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t border-slate-200 bg-slate-50 py-2 flex flex-col gap-3">
              {/* Engagement Stats */}
              <div className="w-full flex gap-4 text-xs text-slate-600 px-2">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" /> {report.likes} likes
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" /> {report.comments?.length || 0} comments
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="w-4 h-4" /> {report.shares} shares
                </span>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex gap-2">
                <Button
                  variant={likedReports.has(report.id) ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleLike(report.id)}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {likedReports.has(report.id) ? 'Liked' : 'Like'}
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Comment
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleShare(report)}>
                      <Share className="w-4 h-4 mr-2" />
                      Share Story
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => shareToSocialMedia(report, 'twitter')}>
                      Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => shareToSocialMedia(report, 'facebook')}>
                      Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => shareToSocialMedia(report, 'linkedin')}>
                      LinkedIn
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => shareToSocialMedia(report, 'whatsapp')}>
                      WhatsApp
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Comment Input */}
              <div className="w-full flex gap-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="Write a supportive comment..."
                  value={commentText[report.id] || ''}
                  onChange={(e) =>
                    setCommentText({ ...commentText, [report.id]: e.target.value })
                  }
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  size="sm"
                  onClick={() => handleComment(report.id)}
                  disabled={loading || !commentText[report.id]?.trim()}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

// Helper component import
import { Send } from 'lucide-react';
