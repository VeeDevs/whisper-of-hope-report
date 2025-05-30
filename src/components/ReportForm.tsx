
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/AppContext";
import { CrisisModal } from "./CrisisModal";
import { EvidenceUpload } from "./EvidenceUpload";
import { EvidenceFile } from "@/types";

export function ReportForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const { createReport } = useApp();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      const isCrisis = createReport(title, content, evidenceFiles);
      setTitle("");
      setContent("");
      setEvidenceFiles([]);
      
      if (isCrisis) {
        setShowCrisisModal(true);
      }
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Create Anonymous Report</CardTitle>
          <CardDescription>
            Your report will be anonymous. Only your anonymous ID will be visible.
            You can optionally attach evidence files for additional context.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <div>
            <EvidenceUpload 
              onFilesUploaded={setEvidenceFiles}
              maxFiles={3}
            />
          </div>
        </CardContent>
      </Card>
      
      <CrisisModal 
        isOpen={showCrisisModal} 
        onClose={() => setShowCrisisModal(false)} 
      />
    </>
  );
}
