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

interface FriendsManagerProps {
  onSelectFriend?: (friendId: string) => void;
}

export function FriendsManager({ onSelectFriend }: FriendsManagerProps) {
  const { currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [listenCloselyList, setListenCloselyList] = useState<User[]>([]);
  const { toast } = useToast();

  type FollowEntry = { id: string; followerId: string; followingId: string; createdAt: string };
  type BlockEntry = { id: string; blockerId: string; blockedId: string; createdAt: string };

  const loadFriends = useCallback(() => {
    if (!currentUser) return;
    const allUsers: User[] = JSON.parse(localStorage.getItem('whisper_users') || '[]');
    const userFriends = currentUser.friends || [];
    const friendUsers = allUsers.filter((user: User) => userFriends.includes(user.id));
    setFriends(friendUsers);
  }, [currentUser]);

  const loadFriendRequests = useCallback(() => {
    if (!currentUser) return;
    const requests: FriendRequest[] = JSON.parse(localStorage.getItem('whisper_friend_requests') || '[]');
    const userRequests = requests.filter((req: FriendRequest) => 
      req.receiverId === currentUser.id && req.status === 'pending'
    );
    setFriendRequests(userRequests);
  }, [currentUser]);

  const loadListenCloselyList = useCallback(() => {
    if (!currentUser) return;
    const allUsers: User[] = JSON.parse(localStorage.getItem('whisper_users') || '[]');
    const followingList: FollowEntry[] = JSON.parse(localStorage.getItem('whisper_listen_closely') || '[]');
    const userFollowing = followingList.filter((follow: FollowEntry) => follow.followerId === currentUser.id);
    const followingUsers = allUsers.filter((user: User) => 
      userFollowing.some((follow: FollowEntry) => follow.followingId === user.id)
    );
    setListenCloselyList(followingUsers);
  }, [currentUser]);

  useEffect(() => {
    loadFriends();
    loadFriendRequests();
    loadListenCloselyList();
  }, [currentUser, loadFriends, loadFriendRequests, loadListenCloselyList]);

  const searchUsers = () => {
    if (!searchQuery.trim() || !currentUser) return;
    
    const allUsers = JSON.parse(localStorage.getItem('whisper_users') || '[]');
    const blockedUsers = JSON.parse(localStorage.getItem('whisper_silenced_voices') || '[]');
  type BlockEntry = { id: string; blockerId: string; blockedId: string; createdAt: string };
  const userBlockedList = blockedUsers.filter((block: BlockEntry) => block.blockerId === currentUser.id);
  const blockedUserIds = userBlockedList.map((block: BlockEntry) => block.blockedId);
    
    const results = allUsers.filter((user: User) => 
      user.id !== currentUser.id &&
      !currentUser.friends?.includes(user.id) &&
      !blockedUserIds.includes(user.id) &&
      (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.anonymousId.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setSearchResults(results);
  };

  const sendReachOut = (targetUserId: string, targetAnonymousId: string) => {
    if (!currentUser) return;

    const newRequest: FriendRequest = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderAnonymousId: currentUser.anonymousId,
      receiverId: targetUserId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      message: `${currentUser.anonymousId} wants to offer support`
    };

    const existingRequests = JSON.parse(localStorage.getItem('whisper_friend_requests') || '[]');
    existingRequests.push(newRequest);
    localStorage.setItem('whisper_friend_requests', JSON.stringify(existingRequests));

    toast({
      title: "Reach out sent",
      description: `Request sent to ${targetAnonymousId}`,
    });

    setSearchResults(prev => prev.filter(user => user.id !== targetUserId));
  };

  const listenClosely = (targetUserId: string, targetAnonymousId: string) => {
    if (!currentUser) return;

    const followEntry = {
      id: Date.now().toString(),
      followerId: currentUser.id,
      followingId: targetUserId,
      createdAt: new Date().toISOString()
    };

    const existingFollows = JSON.parse(localStorage.getItem('whisper_listen_closely') || '[]');
    const alreadyFollowing = existingFollows.some((follow: FollowEntry) => 
      follow.followerId === currentUser.id && follow.followingId === targetUserId
    );

    if (alreadyFollowing) {
      toast({
        title: "Already listening closely",
        description: `You are already listening closely to ${targetAnonymousId}`,
        variant: "destructive",
      });
      return;
    }

    existingFollows.push(followEntry);
    localStorage.setItem('whisper_listen_closely', JSON.stringify(existingFollows));

    loadListenCloselyList();

    toast({
      title: "Now listening closely",
      description: `You are now listening closely to ${targetAnonymousId}`,
    });
  };

  const silenceVoice = (targetUserId: string, targetAnonymousId: string) => {
    if (!currentUser) return;

    const blockEntry = {
      id: Date.now().toString(),
      blockerId: currentUser.id,
      blockedId: targetUserId,
      createdAt: new Date().toISOString()
    };

    const existingBlocks = JSON.parse(localStorage.getItem('whisper_silenced_voices') || '[]');
    existingBlocks.push(blockEntry);
    localStorage.setItem('whisper_silenced_voices', JSON.stringify(existingBlocks));

    // Remove from friends if they are friends
    const allUsers = JSON.parse(localStorage.getItem('whisper_users') || '[]');
    const currentUserIndex = allUsers.findIndex((user: User) => user.id === currentUser.id);
    if (currentUserIndex !== -1) {
      allUsers[currentUserIndex].friends = (allUsers[currentUserIndex].friends || []).filter((id: string) => id !== targetUserId);
      localStorage.setItem('whisper_users', JSON.stringify(allUsers));
      localStorage.setItem('whisper_current_user', JSON.stringify(allUsers[currentUserIndex]));
    }

    // Remove from search results and refresh lists
    setSearchResults(prev => prev.filter(user => user.id !== targetUserId));
    loadFriends();
    loadListenCloselyList();

    toast({
      title: "Voice silenced",
      description: `${targetAnonymousId} has been silenced`,
    });
  };

  const stopListeningClosely = (targetUserId: string, targetAnonymousId: string) => {
    if (!currentUser) return;

    const existingFollows = JSON.parse(localStorage.getItem('whisper_listen_closely') || '[]');
    const updatedFollows = existingFollows.filter((follow: FollowEntry) => 
      !(follow.followerId === currentUser.id && follow.followingId === targetUserId)
    );
    localStorage.setItem('whisper_listen_closely', JSON.stringify(updatedFollows));

    loadListenCloselyList();

    toast({
      title: "Stopped listening closely",
      description: `No longer listening closely to ${targetAnonymousId}`,
    });
  };

  const handleReachOutRequest = (requestId: string, action: 'accept' | 'reject') => {
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
        title: "Support connection accepted",
        description: `You are now connected with ${request.senderAnonymousId}`,
      });
    } else {
      toast({
        title: "Reach out declined",
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
                      <p className="font-medium">{friend.anonymousId}</p>
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
                        onClick={() => silenceVoice(friend.id, friend.anonymousId)}
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
                      <p className="font-medium">{user.anonymousId}</p>
                      <p className="text-sm text-muted-foreground">{user.institution}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => stopListeningClosely(user.id, user.anonymousId)}
                      >
                        Stop Listening
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => silenceVoice(user.id, user.anonymousId)}
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
                      <p className="font-medium">{user.anonymousId}</p>
                      <p className="text-sm text-muted-foreground">{user.institution}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => sendReachOut(user.id, user.anonymousId)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Offer Support
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => listenClosely(user.id, user.anonymousId)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Listen Closely
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => silenceVoice(user.id, user.anonymousId)}
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
                        onClick={() => handleReachOutRequest(request.id, 'accept')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReachOutRequest(request.id, 'reject')}
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
