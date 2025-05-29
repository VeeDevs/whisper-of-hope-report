
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye } from "lucide-react";

export function StealthMode() {
  const [isStealthActive, setIsStealthActive] = useState(false);
  const [originalTitle, setOriginalTitle] = useState(document.title);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        toggleStealth();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const toggleStealth = () => {
    if (!isStealthActive) {
      // Activate stealth mode
      setOriginalTitle(document.title);
      document.title = "Spreadsheet - Google Sheets";
      document.body.style.display = 'none';
      
      // Create fake spreadsheet overlay
      const overlay = document.createElement('div');
      overlay.id = 'stealth-overlay';
      overlay.innerHTML = `
        <div style="background: white; height: 100vh; font-family: Arial, sans-serif;">
          <div style="background: #f8f9fa; padding: 10px; border-bottom: 1px solid #dadce0;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 20px; height: 20px; background: #4285f4; border-radius: 2px;"></div>
              <span style="font-weight: 500;">Google Sheets</span>
            </div>
          </div>
          <div style="padding: 20px;">
            <div style="display: grid; grid-template-columns: 50px repeat(10, 1fr); gap: 1px; background: #f0f0f0;">
              <div style="background: #f8f9fa; padding: 8px; font-weight: bold;"></div>
              ${Array.from({length: 10}, (_, i) => `<div style="background: #f8f9fa; padding: 8px; font-weight: bold;">${String.fromCharCode(65 + i)}</div>`).join('')}
              ${Array.from({length: 20}, (_, row) => 
                `<div style="background: #f8f9fa; padding: 8px; font-weight: bold;">${row + 1}</div>` +
                Array.from({length: 10}, (_, col) => 
                  `<div style="background: white; padding: 8px; border: 1px solid #dadce0;">${
                    row === 0 && col === 0 ? 'Budget Analysis' : 
                    row === 1 && col === 0 ? 'Q1 Revenue' :
                    row === 2 && col === 0 ? 'Q2 Revenue' :
                    row === 0 && col === 1 ? '2024' :
                    row === 1 && col === 1 ? '$45,000' :
                    row === 2 && col === 1 ? '$52,000' : ''
                  }</div>`
                ).join('')
              ).join('')}
            </div>
            <div style="margin-top: 20px; color: #666; font-size: 12px;">
              Press ESC again to return to your previous session
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      setIsStealthActive(true);
    } else {
      // Deactivate stealth mode
      document.title = originalTitle;
      document.body.style.display = '';
      const overlay = document.getElementById('stealth-overlay');
      if (overlay) {
        overlay.remove();
      }
      setIsStealthActive(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleStealth}
        className={`
          ${isStealthActive 
            ? "bg-red-100 hover:bg-red-200 border-red-300 text-red-700" 
            : "bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-700"
          }
          shadow-lg backdrop-blur-sm transition-all duration-200
        `}
        title={isStealthActive ? "Exit Stealth Mode (ESC)" : "Activate Stealth Mode (ESC)"}
      >
        {isStealthActive ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
