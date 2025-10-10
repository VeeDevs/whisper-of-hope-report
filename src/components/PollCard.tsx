
import { Poll, PollVote } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useApp } from "@/hooks/use-app";

interface PollCardProps {
  poll: Poll;
  userVote?: PollVote;
}

export function PollCard({ poll, userVote }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const { votePoll } = useApp();

  const handleVote = () => {
    if (selectedOption && !userVote) {
      votePoll(poll.id, selectedOption);
    }
  };

  const isExpired = new Date(poll.expiresAt) < new Date();
  const hasVoted = !!userVote;

  return (
    <Card className="hover:border-whisper-300 transition-colors">
      <CardHeader>
        <CardTitle className="text-lg">{poll.question}</CardTitle>
        <div className="text-sm text-muted-foreground">
          <div className="flex justify-between items-center">
            <div>
              <span>By {poll.anonymousId}</span>
              {poll.institution && <span className="text-whisper-700 font-medium"> • {poll.institution}</span>}
            </div>
            <span>{formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
            const isSelected = selectedOption === option.id;
            const isUserChoice = userVote?.optionId === option.id;

            return (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label 
                    className={`flex-1 cursor-pointer p-3 rounded border transition-colors ${
                      isSelected ? 'border-whisper-500 bg-whisper-50' : 'border-gray-200'
                    } ${isUserChoice ? 'bg-green-50 border-green-300' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`poll-${poll.id}`}
                      value={option.id}
                      checked={isSelected}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      disabled={hasVoted || isExpired}
                      className="mr-2"
                    />
                    {option.text}
                    {isUserChoice && <span className="ml-2 text-green-600 text-xs">✓ Your vote</span>}
                  </label>
                  {(hasVoted || isExpired) && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {option.votes} ({percentage.toFixed(1)}%)
                    </span>
                  )}
                </div>
                {(hasVoted || isExpired) && (
                  <Progress value={percentage} className="h-2" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {poll.totalVotes} total votes
          </span>
          {!hasVoted && !isExpired && (
            <Button 
              onClick={handleVote} 
              disabled={!selectedOption}
              size="sm"
            >
              Vote
            </Button>
          )}
          {isExpired && (
            <span className="text-sm text-red-500">Poll expired</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
