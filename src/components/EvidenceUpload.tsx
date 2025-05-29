
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Eye, EyeOff, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EvidenceUploadProps {
  onFilesUploaded: (files: File[]) => void;
}

export function EvidenceUpload({ onFilesUploaded }: EvidenceUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [blurredUrls, setBlurredUrls] = useState<string[]>([]);
  const [isBlurred, setIsBlurred] = useState<boolean[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB limit.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    
    // Initialize blur states
    setIsBlurred(prev => [...prev, ...validFiles.map(() => false)]);
    setBlurredUrls(prev => [...prev, ...validFiles.map(() => '')]);

    onFilesUploaded([...uploadedFiles, ...validFiles]);

    toast({
      title: "Files uploaded",
      description: `${validFiles.length} file(s) uploaded successfully.`,
    });
  };

  const applyBlur = async (index: number) => {
    const file = uploadedFiles[index];
    if (!file || !file.type.startsWith('image/')) return;

    // Create canvas to apply blur effect
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        // Apply blur filter
        ctx.filter = 'blur(10px)';
        ctx.drawImage(img, 0, 0);
        
        // Create blurred URL
        canvas.toBlob(blob => {
          if (blob) {
            const blurredUrl = URL.createObjectURL(blob);
            setBlurredUrls(prev => {
              const newUrls = [...prev];
              newUrls[index] = blurredUrl;
              return newUrls;
            });
            
            setIsBlurred(prev => {
              const newStates = [...prev];
              newStates[index] = true;
              return newStates;
            });
          }
        }, 'image/jpeg', 0.8);
      }
    };

    img.src = previewUrls[index];
  };

  const toggleBlur = (index: number) => {
    if (isBlurred[index]) {
      // Remove blur
      setIsBlurred(prev => {
        const newStates = [...prev];
        newStates[index] = false;
        return newStates;
      });
    } else {
      // Apply blur
      applyBlur(index);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Revoke URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
    setBlurredUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      if (prev[index]) URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
    setIsBlurred(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidence Upload</CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload images or documents as evidence. We'll automatically blur sensitive content.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              Click to upload images or documents
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Supports: JPG, PNG, PDF (max 10MB each)
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Files
            </Button>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Uploaded Files:</h4>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{file.name}</span>
                    <div className="flex gap-2">
                      {file.type.startsWith('image/') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleBlur(index)}
                        >
                          {isBlurred[index] ? (
                            <>
                              <Eye className="h-4 w-4 mr-1" />
                              Unblur
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4 mr-1" />
                              Blur
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  
                  {file.type.startsWith('image/') && (
                    <div className="mt-2">
                      <img
                        src={isBlurred[index] ? blurredUrls[index] : previewUrls[index]}
                        alt={`Preview ${index + 1}`}
                        className="max-w-full h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-1">
                    Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    {isBlurred[index] && " • Blurred for privacy"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
