
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export function Navbar() {
  const { currentUser, logout } = useApp();

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-whisper-700">
          <Shield className="h-6 w-6" />
          <span>Whisper of Hope</span>
        </Link>
        <nav className="hidden md:flex gap-6 font-medium">
          <Link to="/" className="hover:text-whisper-700 transition-colors">
            Home
          </Link>
          <Link to="/reports" className="hover:text-whisper-700 transition-colors">
            Reports
          </Link>
          <Link to="/about" className="hover:text-whisper-700 transition-colors">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <div>Anonymous ID: <span className="font-medium text-foreground">{currentUser.anonymousId}</span></div>
                {currentUser.institution && (
                  <div className="text-xs text-whisper-700">{currentUser.institution}</div>
                )}
              </div>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
