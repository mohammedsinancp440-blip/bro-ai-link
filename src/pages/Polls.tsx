import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import { PollCard } from '@/components/PollCard';
import { CreatePollDialog } from '@/components/CreatePollDialog';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface Poll {
  id: string;
  title: string;
  description: string | null;
  options: { text: string }[];
  expires_at: string | null;
  created_at: string;
  userVote?: number;
  votes: { selected_option: number }[];
}

const Polls = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loadingPolls, setLoadingPolls] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPolls();
    }
  }, [user]);

  const fetchPolls = async () => {
    try {
      setLoadingPolls(true);
      
      // Fetch polls
      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (pollsError) throw pollsError;

      // Fetch all votes
      const { data: votesData, error: votesError } = await supabase
        .from('poll_votes')
        .select('*');

      if (votesError) throw votesError;

      // Combine polls with votes
      const pollsWithVotes = pollsData.map(poll => ({
        ...poll,
        options: poll.options as { text: string }[],
        votes: votesData?.filter(v => v.poll_id === poll.id) || [],
        userVote: votesData?.find(v => v.poll_id === poll.id && v.user_id === user?.id)?.selected_option
      }));

      setPolls(pollsWithVotes);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingPolls(false);
    }
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
    try {
      const { error } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: pollId,
          user_id: user?.id,
          selected_option: optionIndex
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Your vote has been recorded',
      });

      fetchPolls();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading || loadingPolls) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Community Polls</h1>
            <p className="text-muted-foreground mt-2">
              Share your opinion on campus matters
            </p>
          </div>
          {userRole === 'admin' && (
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Poll
            </Button>
          )}
        </div>

        {polls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No active polls at the moment</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {polls.map(poll => (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={handleVote}
              />
            ))}
          </div>
        )}
      </div>

      <CreatePollDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchPolls}
      />
    </div>
  );
};

export default Polls;
