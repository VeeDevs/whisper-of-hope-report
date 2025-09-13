import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const TermsModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("wof_terms_accepted");
    if (!accepted) setOpen(true);
  }, []);

  const accept = () => {
    localStorage.setItem("wof_terms_accepted", "true");
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-6 text-gray-900 dark:text-gray-100">
        <h2 className="text-xl font-bold mb-2">Terms and Conditions</h2>
        <p className="mb-4 text-sm">
          Please review and accept our <Link to="/terms" className="text-blue-600 dark:text-blue-400 underline">Terms and Conditions</Link> and <Link to="/privacy" className="text-blue-600 dark:text-blue-400 underline">Privacy Policy</Link> before using Whisper of Hope.
        </p>
        <div className="flex gap-4 justify-end">
          <Link to="/terms" className="text-sm underline text-blue-600 dark:text-blue-400">View Terms</Link>
          <Link to="/privacy" className="text-sm underline text-blue-600 dark:text-blue-400">View Privacy</Link>
          <button
            onClick={accept}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
