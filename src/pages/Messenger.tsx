import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string;
  email: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender?: Profile;
}

const Messenger = () => {
  const { user, userRole } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user, userRole]);

  useEffect(() => {
    if (selectedProfile && user) {
      fetchMessages();
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.new.sender_id === selectedProfile.id) {
              fetchMessages();
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedProfile, user]);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user?.id);

    if (error) {
      console.error('Error fetching profiles:', error);
    } else {
      setProfiles(data || []);
    }
  };

  const fetchMessages = async () => {
    if (!selectedProfile || !user) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:profiles!messages_sender_id_fkey(*)')
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${selectedProfile.id}),and(sender_id.eq.${selectedProfile.id},receiver_id.eq.${user.id})`
      )
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProfile || !user) return;

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: selectedProfile.id,
      content: newMessage.trim(),
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } else {
      setNewMessage('');
      fetchMessages();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {/* Users List */}
          <Card className="md:col-span-1 overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto h-[calc(100%-5rem)]">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile)}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b ${
                    selectedProfile?.id === profile.id ? 'bg-muted' : ''
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{profile.full_name}</p>
                    <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-3 flex flex-col">
            {selectedProfile ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {selectedProfile.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedProfile.full_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{selectedProfile.email}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.sender_id === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a contact to start messaging
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Messenger;
