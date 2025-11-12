import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/hooks/use-app";
import { formatDistanceToNow } from "date-fns";

type DBMessage = {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  sender_anonymous_id?: string;
};

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  senderAnonymousId: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetAnonymousId: string;
}

export function ChatModal({ isOpen, onClose, targetUserId, targetAnonymousId }: ChatModalProps) {
  const { currentUser, supabase } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load chat messages
  useEffect(() => {
    if (!isOpen || !currentUser) return;

    const loadMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      if (!error && data) {
        // map DB rows to Message[]
        type DBMessage = {
          id: string;
          content: string;
          sender_id: string;
          receiver_id: string;
          created_at: string;
          sender_anonymous_id?: string;
        };
        const mapped = (data as DBMessage[]).map((r) => ({
          id: r.id,
          content: r.content,
          senderId: r.sender_id,
          receiverId: r.receiver_id,
          createdAt: r.created_at,
          senderAnonymousId: r.sender_anonymous_id
        }));
        setMessages(mapped);
      }
      setLoading(false);
    };

    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        // Note: Realtime filters expect snake_case column names
        filter: `sender_id=eq.${currentUser.id},receiver_id=eq.${targetUserId}`,
      }, (payload) => {
        const r = payload.new as DBMessage;
        const mapped: Message = {
          id: r.id,
          content: r.content,
          senderId: r.sender_id,
          receiverId: r.receiver_id,
          createdAt: r.created_at,
          senderAnonymousId: r.sender_anonymous_id
        };
        setMessages(prev => [...prev, mapped]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, currentUser, targetUserId, supabase]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const message = {
      content: newMessage,
      sender_id: currentUser.id,
      receiver_id: targetUserId,
      sender_anonymous_id: currentUser.anonymous_id,
      created_at: new Date().toISOString(),
    };

    const client = supabase as any;
    const { error } = await client.from('chat_messages').insert([message]);

    if (!error) {
      setNewMessage("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chat with {targetAnonymousId}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.senderId === currentUser?.id
                      ? 'bg-whisper-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}