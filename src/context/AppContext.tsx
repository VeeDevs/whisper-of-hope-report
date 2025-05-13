
import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { User, Report } from "../types";
import { 
  getCurrentUser, 
  getReports, 
  saveReport, 
  addComment,
  logoutUser
} from "../services/storage";
import { useToast } from "@/hooks/use-toast";

interface AppContextType {
  currentUser: User | null;
  reports: Report[];
  isLoading: boolean;
  setCurrentUser: (user: User) => void;
  logout: () => void;
  createReport: (title: string, content: string) => void;
  addCommentToReport: (reportId: string, content: string) => void;
  refreshReports: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load user and reports from storage on initial render
    const user = getCurrentUser();
    setCurrentUser(user);
    refreshReports();
    setIsLoading(false);
  }, []);

  const refreshReports = () => {
    const loadedReports = getReports();
    setReports(loadedReports);
  };

  const logout = () => {
    logoutUser();
    setCurrentUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const createReport = (title: string, content: string) => {
    if (!currentUser) return;

    const newReport: Report = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
      anonymousId: currentUser.anonymousId,
      comments: [],
    };

    saveReport(newReport);
    refreshReports();
    toast({
      title: "Report submitted",
      description: "Your anonymous report has been submitted successfully.",
    });
  };

  const addCommentToReport = (reportId: string, content: string) => {
    if (!currentUser) return;

    const newComment = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString(),
      anonymousId: currentUser.anonymousId,
      reportId,
    };

    addComment(reportId, newComment);
    refreshReports();
    toast({
      title: "Comment added",
      description: "Your anonymous comment has been added.",
    });
  };

  const value = {
    currentUser,
    reports,
    isLoading,
    setCurrentUser,
    logout,
    createReport,
    addCommentToReport,
    refreshReports,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
