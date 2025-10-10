
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Phone } from "lucide-react";
import { useApp } from "@/hooks/use-app";
import { formatDistanceToNow } from "date-fns";

export function CheckInReminder() {
  const { currentUser, scheduleCheckIn, completeCheckIn } = useApp();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [lastReportDate, setLastReportDate] = useState<Date | null>(null);

  useEffect(() => {
    // Check if user needs a check-in
    if (currentUser?.lastCheckIn) {
      const lastCheckIn = new Date(currentUser.lastCheckIn);
      const daysSinceCheckIn = Math.floor((Date.now() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceCheckIn >= 3) {
        setShowCheckIn(true);
      }
    }
  }, [currentUser]);

  const handleCheckInResponse = (response: 'better' | 'same' | 'worse') => {
    completeCheckIn(response);
    setShowCheckIn(false);
    
    if (response === 'worse') {
      // Show crisis resources immediately
      setTimeout(() => {
        const crisisModal = document.querySelector('[data-crisis-modal]');
        if (crisisModal) {
          (crisisModal as HTMLElement).click();
        }
      }, 1000);
    }
  };

  if (!showCheckIn || !currentUser) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Heart className="h-5 w-5" />
          How are you feeling?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-blue-600">
            It's been a while since your last report. We wanted to check in and see how you're doing.
          </p>

          <div className="space-y-2">
            <p className="text-sm font-medium">Compared to when you first reported, how are you feeling now?</p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1 text-green-600 border-green-300 hover:bg-green-50"
                onClick={() => handleCheckInResponse('better')}
              >
                😊 Better
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                onClick={() => handleCheckInResponse('same')}
              >
                😐 About the same
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => handleCheckInResponse('worse')}
              >
                😔 Worse
              </Button>
            </div>
          </div>

          <div className="bg-blue-100 p-3 rounded text-sm">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-700">Remember, help is always available:</span>
            </div>
            <div className="text-blue-600">
              <div>SADAG: 011 234 4837</div>
              <div>Suicide Crisis Line: 0800 567 567</div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCheckIn(false)}
            className="w-full text-blue-600"
          >
            Maybe later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
