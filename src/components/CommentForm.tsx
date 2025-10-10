
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/hooks/use-app";
import { CrisisModal } from "./CrisisModal";

interface CommentFormProps {
  reportId: string;
}

export function CommentForm({ reportId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const { addCommentToReport } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      const isCrisis = addCommentToReport(reportId, content);
      setContent("");
      
      if (isCrisis) {
        setShowCrisisModal(true);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div className="space-y-2">
          <label htmlFor="comment" className="text-sm font-medium">
            Add a Comment
          </label>
          <Textarea
            id="comment"
            placeholder="Share your thoughts or support..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            required
          />
        </div>
        <Button type="submit">
          Post Comment
        </Button>
      </form>
      
      <CrisisModal 
        isOpen={showCrisisModal} 
        onClose={() => setShowCrisisModal(false)} 
      />
    </>
  );
}
