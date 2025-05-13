
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="inline-block p-3 bg-whisper-100 rounded-full mb-2">
          <Shield className="h-12 w-12 text-whisper-600" />
        </div>
        <h1 className="text-4xl font-bold text-whisper-800">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
