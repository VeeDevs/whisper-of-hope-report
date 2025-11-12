import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, MessageCircle, Search, Check, X, Eye, VolumeX } from "lucide-react";
import { useApp } from "@/hooks/use-app";
import { useToast } from "@/hooks/use-toast";
import { User, FriendRequest } from "@/types";
import { supabase } from "@/lib/supabase";

interface FriendsManagerProps {
  onSelectFriend?: (friendId: string) => void;
}

export function FriendsManager({ onSelectFriend }: FriendsManagerProps) {
  const { currentUser, session } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [listenCloselyList, setListenCloselyList] = useState<User[]>([]);
  const { toast } = useToast();

  const loadFriends = useCallback(async () => {
    if (!currentUser) return;
    const { data, error } = await supabase
      .from('friends')
      .select('friend_id')
      .eq('user_id', currentUser.user_id);

    if (error) {
      console.error("Error fetching friends:", error);
      return;
    }

  const friendIds = (data as unknown as { friend_id: string }[]).map(f => f.friend_id);

    const { data: friendProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .in('user_id', friendIds);

    if (profileError) {
      console.error("Error fetching friend profiles:", profileError);
      return;
    }
    setFriends(friendProfiles as unknown as User[]);
  }, [currentUser]);

  const loadFriendRequests = useCallback(async () => {
    if (!currentUser) return;
    const { data, error } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('receiver_id', currentUser.user_id)
      .eq('status', 'pending');
    
    if (error) {
      console.error("Error fetching friend requests:", error);
      return;
    }
    setFriendRequests(data as unknown as FriendRequest[]);
  }, [currentUser]);

  const loadListenCloselyList = useCallback(async () => {
    // This feature seems to be local-only for now.
    // If it were in the DB, it would be loaded here.
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadFriends();
      loadFriendRequests();
      loadListenCloselyList();
    }
  }, [currentUser, loadFriends, loadFriendRequests, loadListenCloselyList]);

  const searchUsers = async () => {
    if (!searchQuery.trim() || !currentUser) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('anonymous_id', `%${searchQuery.trim()}%`)
      .neq('user_id', currentUser.user_id);

    if (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
      return;
    }

    const { data: currentFriends, error: friendsError } = await supabase
      .from('friends')
      .select('friend_id')
      .eq('user_id', currentUser.user_id);

    if (friendsError) {
      console.error("Error fetching friends for search filter:", friendsError);
      return;
    }
  const friendIds = (currentFriends as unknown as { friend_id: string }[]).map(f => f.friend_id);
    
  const results = ((data || []) as unknown as { user_id: string }[]).filter(user => !friendIds.includes(user.user_id));
    setSearchResults(results as unknown as User[]);
  };

  const sendReachOut = async (targetUserId: string, targetAnonymousId: string) => {
    if (!currentUser) return;

    const client = supabase as any;
    const { error } = await client.from('friend_requests').insert({
      sender_id: currentUser.user_id,
      receiver_id: targetUserId,
      status: 'pending',
      sender_anonymous_id: currentUser.anonymous_id,
    });

    if (error) {
      toast({ title: "Error sending request", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Reach out sent",
        description: `Request sent to ${targetAnonymousId}`,
      });
      setSearchResults(prev => prev.filter(user => user.user_id !== targetUserId));
    }
  };

  const listenClosely = (targetUserId: string, targetAnonymousId: string) => {
    if (!currentUser) return;
    // This is a local-only feature for now.
    toast({ title: "Listening Closely", description: `You are now listening closely to ${targetAnonymousId}` });
  };

  const silenceVoice = (targetUserId: string, targetAnonymousId: string) => {
    if (!currentUser) return;
    // This is a local-only feature for now.
    toast({ title: "Voice Silenced", description: `${targetAnonymousId} has been silenced.` });
  };

  const stopListeningClosely = (targetUserId: string, targetAnonymousId: string) => {
    if (!currentUser) return;
    // This is a local-only feature for now.
    toast({ title: "Stopped Listening", description: `You are no longer listening to ${targetAnonymousId}.` });
  };

  const handleReachOutRequest = async (request: FriendRequest, action: 'accept' | 'reject') => {
    if (!currentUser) return;

    const client = supabase as any;
    if (action === 'accept') {
      const { error: friendError } = await client.from('friends').insert([
  { user_id: request.senderId, friend_id: request.receiverId },
  { user_id: request.receiverId, friend_id: request.senderId },
      ]);

      if (friendError) {
        toast({ title: "Error accepting request", description: friendError.message, variant: "destructive" });
        return;
      }
    }

    const { error: updateError } = await client
      .from('friend_requests')
      .update({ status: action })
      .eq('id', request.id);

    if (updateError) {
      toast({ title: "Error updating request", description: updateError.message, variant: "destructive" });
    } else {
      if (action === 'accept') {
        toast({
          title: "Support connection accepted",
          description: `You are now connected with ${request.senderAnonymousId}`,
        });
      } else {
        toast({
          title: "Reach out declined",
          description: "The request has been declined",
        });
      }
      loadFriends();
      loadFriendRequests();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Support Network & Connections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="friends">Shared Strength ({friends.length})</TabsTrigger>
            <TabsTrigger value="listening">Listen Closely ({listenCloselyList.length})</TabsTrigger>
            <TabsTrigger value="search">Find Support</TabsTrigger>
            <TabsTrigger value="requests">
              Reach Outs 
              {friendRequests.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                  {friendRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-4">
            {friends.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No connections yet. Start by searching for people to offer support with.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{friend.anonymous_id}</p>
                      <p className="text-sm text-muted-foreground">{friend.institution}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onSelectFriend?.(friend.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => silenceVoice(friend.id, friend.anonymous_id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <VolumeX className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="listening" className="space-y-4">
            {listenCloselyList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Not listening closely to anyone yet. Use "Listen Closely" to follow others' updates.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {listenCloselyList.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.anonymous_id}</p>
                      <p className="text-sm text-muted-foreground">{user.institution}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => stopListeningClosely(user.id, user.anonymous_id)}
                      >
                        Stop Listening
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => silenceVoice(user.id, user.anonymous_id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <VolumeX className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by username or anonymous ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
              />
              <Button onClick={searchUsers}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.anonymous_id}</p>
                      <p className="text-sm text-muted-foreground">{user.institution}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => sendReachOut(user.id, user.anonymous_id)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Offer Support
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => listenClosely(user.id, user.anonymous_id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Listen Closely
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => silenceVoice(user.id, user.anonymous_id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <VolumeX className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {friendRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending reach out requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {friendRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{request.senderAnonymousId}</p>
                      <p className="text-sm text-muted-foreground">{request.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReachOutRequest(request, 'accept')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReachOutRequest(request, 'reject')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
