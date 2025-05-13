
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/AppContext";

interface CommentFormProps {
  reportId: string;
}

export function CommentForm({ reportId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const { addCommentToReport } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      addCommentToReport(reportId, content);
      setContent("");
    }
  };

  return (
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
  );
}
