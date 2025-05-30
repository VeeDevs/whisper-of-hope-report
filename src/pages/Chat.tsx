
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { FriendsManager } from "@/components/FriendsManager";
import { GroupManager } from "@/components/GroupManager";
import { ChatInterface } from "@/components/ChatInterface";
import { StealthMode } from "@/components/StealthMode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/AppContext";
import { Navigate } from "react-router-dom";

export default function Chat() {
  const { currentUser } = useApp();
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("network");

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleSelectFriend = (friendId: string) => {
    setSelectedFriend(friendId);
    setSelectedGroup(null);
    setActiveTab("chat");
  };

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroup(groupId);
    setSelectedFriend(null);
    setActiveTab("chat");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Connect & Support</h1>
            <p className="text-muted-foreground">
              Build your support network and join group discussions in a safe, anonymous environment
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="network">Support Network</TabsTrigger>
              <TabsTrigger value="groups">Discussion Groups</TabsTrigger>
              <TabsTrigger value="chat" disabled={!selectedFriend && !selectedGroup}>
                Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="network" className="mt-6">
              <FriendsManager onSelectFriend={handleSelectFriend} />
            </TabsContent>

            <TabsContent value="groups" className="mt-6">
              <GroupManager onSelectGroup={handleSelectGroup} />
            </TabsContent>

            <TabsContent value="chat" className="mt-6">
              {selectedFriend && (
                <ChatInterface friendId={selectedFriend} />
              )}
              {selectedGroup && (
                <ChatInterface groupId={selectedGroup} />
              )}
              {!selectedFriend && !selectedGroup && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Select a connection or group to start chatting</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <StealthMode />
    </div>
  );
}
