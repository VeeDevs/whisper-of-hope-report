
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, MessageCircle, Search, Check, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { User, FriendRequest } from "@/types";

export function FriendsManager() {
  const { currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadFriends();
    loadFriendRequests();
  }, [currentUser]);

  const loadFriends = () => {
    if (!currentUser) return;
    
    const allUsers = JSON.parse(localStorage.getItem('whisper_users') || '[]');
    const userFriends = currentUser.friends || [];
    const friendUsers = allUsers.filter((user: User) => userFriends.includes(user.id));
    setFriends(friendUsers);
  };

  const loadFriendRequests = () => {
    if (!currentUser) return;
    
    const requests = JSON.parse(localStorage.getItem('whisper_friend_requests') || '[]');
    const userRequests = requests.filter((req: FriendRequest) => 
      req.receiverId === currentUser.id && req.status === 'pending'
    );
    setFriendRequests(userRequests);
  };

  const searchUsers = () => {
    if (!searchQuery.trim() || !currentUser) return;
    
    const allUsers = JSON.parse(localStorage.getItem('whisper_users') || '[]');
    const results = allUsers.filter((user: User) => 
      user.id !== currentUser.id &&
      !currentUser.friends?.includes(user.id) &&
      (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.anonymousId.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setSearchResults(results);
  };

  const sendFriendRequest = (targetUserId: string, targetAnonymousId: string) => {
    if (!currentUser) return;

    const newRequest: FriendRequest = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderAnonymousId: currentUser.anonymousId,
      receiverId: targetUserId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      message: `${currentUser.anonymousId} wants to be friends`
    };

    const existingRequests = JSON.parse(localStorage.getItem('whisper_friend_requests') || '[]');
    existingRequests.push(newRequest);
    localStorage.setItem('whisper_friend_requests', JSON.stringify(existingRequests));

    toast({
      title: "Friend request sent",
      description: `Request sent to ${targetAnonymousId}`,
    });

    setSearchResults(prev => prev.filter(user => user.id !== targetUserId));
  };

  const handleFriendRequest = (requestId: string, action: 'accept' | 'reject') => {
    if (!currentUser) return;

    const requests = JSON.parse(localStorage.getItem('whisper_friend_requests') || '[]');
    const requestIndex = requests.findIndex((req: FriendRequest) => req.id === requestId);
    
    if (requestIndex === -1) return;

    const request = requests[requestIndex];
    requests[requestIndex].status = action === 'accept' ? 'accepted' : 'rejected';
    localStorage.setItem('whisper_friend_requests', JSON.stringify(requests));

    if (action === 'accept') {
      // Add to friends list
      const allUsers = JSON.parse(localStorage.getItem('whisper_users') || '[]');
      
      // Update current user's friends
      const currentUserIndex = allUsers.findIndex((user: User) => user.id === currentUser.id);
      if (currentUserIndex !== -1) {
        allUsers[currentUserIndex].friends = [...(allUsers[currentUserIndex].friends || []), request.senderId];
      }

      // Update sender's friends
      const senderIndex = allUsers.findIndex((user: User) => user.id === request.senderId);
      if (senderIndex !== -1) {
        allUsers[senderIndex].friends = [...(allUsers[senderIndex].friends || []), currentUser.id];
      }

      localStorage.setItem('whisper_users', JSON.stringify(allUsers));
      
      // Update current user in localStorage
      const updatedCurrentUser = allUsers[currentUserIndex];
      localStorage.setItem('whisper_current_user', JSON.stringify(updatedCurrentUser));

      loadFriends();
      
      toast({
        title: "Friend request accepted",
        description: `You are now friends with ${request.senderAnonymousId}`,
      });
    } else {
      toast({
        title: "Friend request rejected",
        description: "The request has been declined",
      });
    }

    loadFriendRequests();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Friends & Connections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="friends">Friends ({friends.length})</TabsTrigger>
            <TabsTrigger value="search">Find Friends</TabsTrigger>
            <TabsTrigger value="requests">
              Requests 
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
                <p>No friends yet. Start by searching for people to connect with.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{friend.anonymousId}</p>
                      <p className="text-sm text-muted-foreground">{friend.institution}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
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
                      <p className="font-medium">{user.anonymousId}</p>
                      <p className="text-sm text-muted-foreground">{user.institution}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => sendFriendRequest(user.id, user.anonymousId)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add Friend
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {friendRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending friend requests</p>
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
                        onClick={() => handleFriendRequest(request.id, 'accept')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleFriendRequest(request.id, 'reject')}
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
