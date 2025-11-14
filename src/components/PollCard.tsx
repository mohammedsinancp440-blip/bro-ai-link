import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { Poll } from '@/pages/Polls';
import { Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionIndex: number) => Promise<void>;
}

export function PollCard({ poll, onVote }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | undefined>(poll.userVote);
  const [voting, setVoting] = useState(false);

  const hasVoted = poll.userVote !== undefined;
  const totalVotes = poll.votes.length;
  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();

  const getVoteCount = (optionIndex: number) => {
    return poll.votes.filter(v => v.selected_option === optionIndex).length;
  };

  const getVotePercentage = (optionIndex: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((getVoteCount(optionIndex) / totalVotes) * 100);
  };

  const handleVote = async () => {
    if (selectedOption === undefined) return;
    setVoting(true);
    try {
      await onVote(poll.id, selectedOption);
    } finally {
      setVoting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        {poll.description && (
          <CardDescription>{poll.description}</CardDescription>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{totalVotes} votes</span>
          </div>
          {poll.expires_at && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {isExpired 
                  ? 'Expired'
                  : `Expires ${format(new Date(poll.expires_at), 'MMM d, yyyy')}`
                }
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!hasVoted && !isExpired ? (
          <div className="space-y-4">
            <RadioGroup
              value={selectedOption?.toString()}
              onValueChange={(value) => setSelectedOption(parseInt(value))}
            >
              {poll.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`${poll.id}-${index}`} />
                  <Label htmlFor={`${poll.id}-${index}`} className="cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button 
              onClick={handleVote} 
              disabled={selectedOption === undefined || voting}
              className="w-full"
            >
              {voting ? 'Submitting...' : 'Submit Vote'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {poll.options.map((option, index) => {
              const voteCount = getVoteCount(index);
              const percentage = getVotePercentage(index);
              const isUserVote = poll.userVote === index;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isUserVote ? 'font-semibold text-primary' : ''}`}>
                      {option.text}
                      {isUserVote && ' ✓'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {voteCount} ({percentage}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
            {isExpired && (
              <p className="text-sm text-muted-foreground text-center mt-4">
                This poll has expired
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
