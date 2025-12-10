
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/hooks/use-app";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";
import { Shield, MessageCircle, ChevronLeft, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const { currentUser, logout } = useApp();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [friendQuery, setFriendQuery] = useState("");

  const quickAddFriend = async () => {
    if (!currentUser || !friendQuery.trim()) return;
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('anonymous_id', `%${friendQuery.trim()}%`)
        .neq('user_id', currentUser.user_id)
        .limit(1);
      if (error) throw error;
      const target = (profiles as unknown as { user_id: string; anonymous_id: string }[])[0];
      if (!target) {
        toast({ title: 'Not found', description: 'No user matched that ID', variant: 'destructive' });
        return;
      }
      const client = supabase as any;
      const { error: reqErr } = await client.from('friend_requests').insert({
        sender_id: currentUser.user_id,
        receiver_id: target.user_id,
        status: 'pending',
        sender_anonymous_id: currentUser.anonymous_id,
      });
      if (reqErr) throw reqErr;
      toast({ title: 'Request sent', description: `Reach out to ${target.anonymous_id}` });
      setFriendQuery("");
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Could not send request', variant: 'destructive' });
    }
  };

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            aria-label="Go back"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 h-9 w-9"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-whisper-700">
            <Shield className="h-6 w-6" />
            <span>{t('whisperOfHope')}</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6 font-medium">
          <Link to="/" className="hover:text-whisper-700 transition-colors">
            {t('home')}
          </Link>
          <Link to="/reports" className="hover:text-whisper-700 transition-colors">
            {t('reports')}
          </Link>
          {currentUser && (
            <Link to="/chat" className="hover:text-whisper-700 transition-colors flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              Chat
            </Link>
          )}
          <Link to="/about" className="hover:text-whisper-700 transition-colors">
            {t('about')}
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LanguageSelector />
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <div>{t('anonymousId')}: <span className="font-medium text-foreground">{currentUser.anonymous_id}</span></div>
                {currentUser.institution && (
                  <div className="text-xs text-whisper-700">{currentUser.institution}</div>
                )}
              </div>
              {/* Quick Add Friend */}
              <div className="hidden md:flex items-center gap-2">
                <Input
                  value={friendQuery}
                  onChange={(e) => setFriendQuery(e.target.value)}
                  placeholder="Find friend by anon ID"
                  className="w-44"
                />
                <Button variant="outline" onClick={quickAddFriend} className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              <Button variant="outline" onClick={logout}>
                {t('logout')}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/auth">{t('auth.signIn')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
