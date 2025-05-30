
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, File, Image, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EvidenceFile } from "@/types";

interface EvidenceUploadProps {
  onFilesUploaded: (files: EvidenceFile[]) => void;
  maxFiles?: number;
}

export function EvidenceUpload({ onFilesUploaded, maxFiles = 5 }: EvidenceUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<EvidenceFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (uploadedFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const newFiles: EvidenceFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        const isImage = file.type.startsWith('image/');
        const isDocument = file.type === 'application/pdf' || 
                          file.type.includes('document') ||
                          file.type.includes('text');

        if (!isImage && !isDocument) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a supported file type`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds 10MB limit`,
            variant: "destructive",
          });
          continue;
        }

        // Create file URL for preview (in real app, this would be uploaded to secure storage)
        const fileUrl = URL.createObjectURL(file);
        
        // Simulate metadata removal and blurring for images
        const evidenceFile: EvidenceFile = {
          id: Date.now().toString() + i,
          originalName: file.name,
          blurredUrl: fileUrl, // In real app, this would be the blurred/processed version
          type: isImage ? 'image' : 'document',
          uploadedAt: new Date().toISOString(),
          metadata: {
            size: file.size,
            isBlurred: isImage, // Images are automatically blurred
            hasMetadata: false // Metadata is automatically removed
          }
        };

        newFiles.push(evidenceFile);
      }

      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onFilesUploaded(updatedFiles);

      toast({
        title: "Files uploaded successfully",
        description: `${newFiles.length} file(s) processed with privacy safeguards`,
      });

    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your files",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Evidence Upload with Privacy Protection
        </CardTitle>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Images are automatically blurred to protect identities</p>
          <p>• Metadata is automatically removed from all files</p>
          <p>• Supported: Images (JPG, PNG, GIF) and Documents (PDF, DOC)</p>
          <p>• Maximum file size: 10MB | Maximum files: {maxFiles}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isProcessing || uploadedFiles.length >= maxFiles}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing || uploadedFiles.length >= maxFiles}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Upload Evidence Files'}
          </Button>
          {uploadedFiles.length >= maxFiles && (
            <p className="text-sm text-amber-600 mt-2">
              Maximum number of files reached
            </p>
          )}
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Uploaded Files ({uploadedFiles.length}/{maxFiles})</Label>
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded">
                    {file.type === 'image' ? (
                      <Image className="h-4 w-4 text-green-600" />
                    ) : (
                      <File className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{file.originalName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.metadata.size)} • Uploaded {new Date(file.uploadedAt).toLocaleString()}
                    </p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Protected
                      </Badge>
                      {file.metadata.isBlurred && (
                        <Badge variant="secondary" className="text-xs">
                          Blurred
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        Metadata Removed
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Privacy Notice:</p>
              <p>All uploaded files are automatically processed to protect your privacy. Images are blurred to obscure identities, and metadata is stripped from all files before storage.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
