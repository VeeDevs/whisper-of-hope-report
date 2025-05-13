
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/AppContext";

export function ReportForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createReport } = useApp();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      createReport(title, content);
      setTitle("");
      setContent("");
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Anonymous Report</CardTitle>
        <CardDescription>
          Your report will be anonymous. Only your anonymous ID will be visible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              placeholder="Brief title of your report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Report Details
            </label>
            <Textarea
              id="content"
              placeholder="Describe the situation in detail..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
