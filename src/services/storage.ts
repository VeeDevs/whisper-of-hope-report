
import { User, Report, Comment } from "../types";

// Local storage keys
const USERS_KEY = "whisper_users";
const REPORTS_KEY = "whisper_reports";
const CURRENT_USER_KEY = "whisper_current_user";

// Helper functions to generate IDs
export const generateUserId = () => Math.random().toString(36).substring(2, 15);
export const generateAnonymousId = () => {
  const adjectives = ["brave", "silent", "kind", "wise", "gentle", "calm", "bold", "quiet", "keen", "noble"];
  const nouns = ["wolf", "eagle", "deer", "owl", "lion", "dove", "fox", "bear", "hawk", "tiger"];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  
  return `${adjective}-${noun}-${number}`;
};

// User functions
export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const currentUser = localStorage.getItem(CURRENT_USER_KEY);
  return currentUser ? JSON.parse(currentUser) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const findUserByUsername = (username: string): User | undefined => {
  const users = getUsers();
  return users.find((user) => user.username.toLowerCase() === username.toLowerCase());
};

// Report functions
export const getReports = (): Report[] => {
  const reports = localStorage.getItem(REPORTS_KEY);
  return reports ? JSON.parse(reports) : [];
};

export const saveReport = (report: Report): void => {
  const reports = getReports();
  reports.unshift(report); // Add to beginning for newest first
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
};

export const getReportById = (id: string): Report | undefined => {
  const reports = getReports();
  return reports.find((report) => report.id === id);
};

export const updateReport = (updatedReport: Report): void => {
  const reports = getReports();
  const index = reports.findIndex((report) => report.id === updatedReport.id);
  
  if (index !== -1) {
    reports[index] = updatedReport;
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  }
};

export const addComment = (reportId: string, comment: Comment): void => {
  const reports = getReports();
  const reportIndex = reports.findIndex((report) => report.id === reportId);
  
  if (reportIndex !== -1) {
    if (!reports[reportIndex].comments) {
      reports[reportIndex].comments = [];
    }
    reports[reportIndex].comments.push(comment);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  }
};
