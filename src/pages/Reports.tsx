
import { Navbar } from "@/components/Navbar";
import { ReportCard } from "@/components/ReportCard";
import { ReportForm } from "@/components/ReportForm";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Reports() {
  const { reports, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community Reports</h1>
            <p className="text-muted-foreground">
              View anonymous reports from the community
            </p>
          </div>
          {currentUser ? (
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-whisper-600 hover:bg-whisper-700"
            >
              {showForm ? "Hide Form" : "Create Report"}
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link to="/login">Login to Report</Link>
            </Button>
          )}
        </div>

        {showForm && currentUser && (
          <div className="mb-8">
            <ReportForm />
          </div>
        )}

        {reports.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">No Reports Yet</h2>
            <p className="text-muted-foreground mb-6">
              Be the first to share a report with the community.
            </p>
            {currentUser && (
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-whisper-600 hover:bg-whisper-700"
              >
                Create First Report
              </Button>
            )}
          </div>
        )}
      </main>

      <footer className="border-t py-6 bg-muted/50">
        <div className="container px-4 md:px-6 text-center text-sm text-muted-foreground">
          Whisper of Hope © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
