import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { X, Plus } from 'lucide-react';

interface CreatePollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreatePollDialog({ open, onOpenChange, onSuccess }: CreatePollDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [expiresAt, setExpiresAt] = useState('');

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a poll title',
        variant: 'destructive',
      });
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast({
        title: 'Error',
        description: 'Please provide at least 2 options',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);

    try {
      const { error } = await supabase
        .from('polls')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          options: validOptions.map(text => ({ text })),
          expires_at: expiresAt || null,
          created_by: user?.id,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Poll created successfully',
      });

      // Reset form
      setTitle('');
      setDescription('');
      setOptions(['', '']);
      setExpiresAt('');
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Poll</DialogTitle>
          <DialogDescription>
            Create a poll to gather community feedback
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to ask?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more context to your poll"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Options *</Label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
            <Input
              id="expires_at"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create Poll'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
