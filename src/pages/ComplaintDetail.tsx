import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/layout/Navbar';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';

interface Complaint {
  id: string;
  complaint_id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  resolution_note: string | null;
  student_id: string;
}

interface Profile {
  full_name: string;
  email: string;
}

const ComplaintDetail = () => {
  const { id } = useParams();
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [studentProfile, setStudentProfile] = useState<Profile | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [newStatus, setNewStatus] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && id) {
      fetchComplaint();
    }
  }, [user, id]);

  const fetchComplaint = async () => {
    try {
      setLoadingData(true);
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setComplaint(data);
      setNewStatus(data.status);
      setResolutionNote(data.resolution_note || '');

      // Fetch student profile if not anonymous
      if (!data.is_anonymous) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', data.student_id)
          .single();
        
        if (profileData) {
          setStudentProfile(profileData);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      navigate('/dashboard');
    } finally {
      setLoadingData(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!complaint) return;

    setUpdating(true);
    try {
      const updates: any = { status: newStatus };
      
      if (resolutionNote.trim()) {
        updates.resolution_note = resolutionNote;
      }

      if (newStatus === 'resolved' || newStatus === 'closed') {
        updates.resolution_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('complaints')
        .update(updates)
        .eq('id', complaint.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Complaint updated successfully!',
      });

      fetchComplaint();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'under_review':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'in_progress':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'resolved':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'closed':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'low':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!complaint) return null;

  const canUpdateStatus = userRole === 'staff' || userRole === 'admin';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm text-muted-foreground">
                      {complaint.complaint_id}
                    </span>
                    <Badge className={getStatusColor(complaint.status)}>
                      {complaint.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(complaint.priority)}>
                      {complaint.priority}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{complaint.title}</CardTitle>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>
                    {complaint.is_anonymous 
                      ? 'Anonymous' 
                      : studentProfile?.full_name || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>{complaint.category}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-foreground/80 whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>

              {complaint.resolution_note && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2">Resolution Note</h3>
                  <p className="text-foreground/80">{complaint.resolution_note}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {canUpdateStatus && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Update Complaint</CardTitle>
                <CardDescription>
                  Update the status and add resolution notes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Resolution Note</Label>
                  <Textarea
                    placeholder="Add notes about the resolution..."
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleUpdateStatus}
                  className="w-full bg-gradient-primary"
                  disabled={updating}
                >
                  {updating ? 'Updating...' : 'Update Complaint'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
