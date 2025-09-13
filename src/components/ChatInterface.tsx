
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Users, Plus, Settings } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, ChatGroup, User } from "@/types";

interface ChatInterfaceProps {
  friendId?: string;
  groupId?: string;
}

export function ChatInterface({ friendId, groupId }: ChatInterfaceProps) {
  const { currentUser } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatPartner, setChatPartner] = useState<User | null>(null);
  const [chatGroup, setChatGroup] = useState<ChatGroup | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadChat();
  }, [friendId, groupId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChat = () => {
    if (!currentUser) return;

    if (friendId) {
      // Load direct chat
      const allUsers = JSON.parse(localStorage.getItem('whisper_users') || '[]');
      const partner = allUsers.find((user: User) => user.id === friendId);
      setChatPartner(partner);
      
      const allMessages = JSON.parse(localStorage.getItem('whisper_chat_messages') || '[]');
      const chatMessages = allMessages.filter((msg: ChatMessage) => 
        (msg.senderId === currentUser.id && msg.receiverId === friendId) ||
        (msg.senderId === friendId && msg.receiverId === currentUser.id)
      );
      setMessages(chatMessages.sort((a: ChatMessage, b: ChatMessage) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ));
    } else if (groupId) {
      // Load group chat
      const allGroups = JSON.parse(localStorage.getItem('whisper_chat_groups') || '[]');
      const group = allGroups.find((g: ChatGroup) => g.id === groupId);
      setChatGroup(group);
      
      const allMessages = JSON.parse(localStorage.getItem('whisper_chat_messages') || '[]');
      const groupMessages = allMessages.filter((msg: ChatMessage) => msg.groupId === groupId);
      setMessages(groupMessages.sort((a: ChatMessage, b: ChatMessage) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ));
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !currentUser) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderAnonymousId: currentUser.anonymousId,
      receiverId: friendId,
      groupId: groupId,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
      isRead: false,
      messageType: 'text'
    };

    const allMessages = JSON.parse(localStorage.getItem('whisper_chat_messages') || '[]');
    allMessages.push(message);
    localStorage.setItem('whisper_chat_messages', JSON.stringify(allMessages));

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Update group last activity if it's a group message
    if (groupId && chatGroup) {
      const allGroups = JSON.parse(localStorage.getItem('whisper_chat_groups') || '[]');
      const groupIndex = allGroups.findIndex((g: ChatGroup) => g.id === groupId);
      if (groupIndex !== -1) {
        allGroups[groupIndex].lastActivity = new Date().toISOString();
        localStorage.setItem('whisper_chat_groups', JSON.stringify(allGroups));
      }
    }

    toast({
      title: "Message sent",
      description: friendId ? `Message sent to ${chatPartner?.anonymousId}` : `Message sent to ${chatGroup?.name}`,
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const chatTitle = friendId 
    ? `Chat with ${chatPartner?.anonymousId || 'Unknown'}`
    : `${chatGroup?.name || 'Group Chat'}`;

  return (
    <Card className="h-[600px] max-h-[90vh] flex flex-col w-full max-w-md mx-auto md:max-w-lg lg:max-w-2xl rounded-none md:rounded-lg shadow-none md:shadow-md border md:border bg-white md:bg-card">
      <CardHeader className="pb-3 sticky top-0 z-10 bg-white md:bg-card">
        <CardTitle className="flex items-center justify-between text-base md:text-lg">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {chatTitle}
          </div>
          {groupId && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Users className="h-3 w-3 mr-1" />
                {chatGroup?.members.length || 0}
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 px-2 md:px-4">
          <div className="space-y-4 py-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85vw] md:max-w-[70%] rounded-lg px-3 py-2 break-words ${
                      message.senderId === currentUser?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {groupId && message.senderId !== currentUser?.id && (
                      <p className="text-xs font-medium mb-1 opacity-70">
                        {message.senderAnonymousId}
                      </p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === currentUser?.id 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-2 md:p-4 bg-white md:bg-card sticky bottom-0 z-10">
          <div className="flex gap-2 items-center">
            <Input
              className="flex-1 min-w-0 text-sm md:text-base py-2 md:py-2.5 px-2 md:px-3 rounded-full md:rounded-lg"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
              autoComplete="off"
            />
            <Button className="px-3 py-2 md:px-4 md:py-2.5 rounded-full md:rounded-lg" onClick={sendMessage} disabled={!newMessage.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
