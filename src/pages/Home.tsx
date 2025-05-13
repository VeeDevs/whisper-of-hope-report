
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { Link } from "react-router-dom";
import { Shield, MessageCircle, Users } from "lucide-react";

export default function Home() {
  const { currentUser } = useApp();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-gradient-to-br from-whisper-50 to-whisper-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="inline-block p-3 bg-white rounded-full shadow-sm mb-4">
                <Shield className="h-10 w-10 text-whisper-600" />
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-whisper-800">
                Whisper of Hope
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                An anonymous platform to report bullying incidents and support others in a safe environment.
              </p>
              <div className="space-x-4 pt-4">
                {currentUser ? (
                  <Button asChild size="lg" className="bg-whisper-600 hover:bg-whisper-700">
                    <Link to="/reports">View Reports</Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="bg-whisper-600 hover:bg-whisper-700">
                    <Link to="/register">Get Started</Link>
                  </Button>
                )}
                <Button asChild variant="outline" size="lg">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-whisper-100 rounded-full">
                  <Shield className="h-8 w-8 text-whisper-600" />
                </div>
                <h3 className="text-xl font-bold">Anonymous Reporting</h3>
                <p className="text-muted-foreground">
                  Report incidents anonymously without fear of retaliation, using your unique anonymous ID.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-whisper-100 rounded-full">
                  <MessageCircle className="h-8 w-8 text-whisper-600" />
                </div>
                <h3 className="text-xl font-bold">Community Support</h3>
                <p className="text-muted-foreground">
                  Comment on reports to offer support and advice to others in need.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-whisper-100 rounded-full">
                  <Users className="h-8 w-8 text-whisper-600" />
                </div>
                <h3 className="text-xl font-bold">Safe Environment</h3>
                <p className="text-muted-foreground">
                  A moderated platform created to foster a supportive and safe community.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Whisper of Hope © {new Date().getFullYear()}</span>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link to="/terms" className="hover:underline">Terms</Link>
              <Link to="/privacy" className="hover:underline">Privacy</Link>
              <Link to="/contact" className="hover:underline">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
