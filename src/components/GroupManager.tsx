
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, MessageCircle, Settings, Crown } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { ChatGroup } from "@/types";

interface GroupManagerProps {
  onSelectGroup: (groupId: string) => void;
}

export function GroupManager({ onSelectGroup }: GroupManagerProps) {
  const { currentUser } = useApp();
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupCategory, setNewGroupCategory] = useState<'support' | 'study' | 'general' | 'crisis'>('general');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadGroups();
  }, [currentUser]);

  const loadGroups = () => {
    if (!currentUser) return;
    
    const allGroups = JSON.parse(localStorage.getItem('whisper_chat_groups') || '[]');
    const userGroups = allGroups.filter((group: ChatGroup) => 
      group.members.includes(currentUser.id)
    );
    setGroups(userGroups);
  };

  const createGroup = () => {
    if (!currentUser || !newGroupName.trim()) return;

    const newGroup: ChatGroup = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      description: newGroupDescription.trim(),
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      members: [currentUser.id],
      admins: [currentUser.id],
      category: newGroupCategory,
      isPrivate: false,
      lastActivity: new Date().toISOString(),
      memberLimit: 50
    };

    const allGroups = JSON.parse(localStorage.getItem('whisper_chat_groups') || '[]');
    allGroups.unshift(newGroup);
    localStorage.setItem('whisper_chat_groups', JSON.stringify(allGroups));

    setGroups(prev => [newGroup, ...prev]);
    setNewGroupName("");
    setNewGroupDescription("");
    setNewGroupCategory('general');
    setIsCreateDialogOpen(false);

    toast({
      title: "Group created",
      description: `${newGroup.name} has been created successfully`,
    });
  };

  const joinGroup = (groupId: string) => {
    if (!currentUser) return;

    const allGroups = JSON.parse(localStorage.getItem('whisper_chat_groups') || '[]');
    const groupIndex = allGroups.findIndex((group: ChatGroup) => group.id === groupId);
    
    if (groupIndex !== -1 && !allGroups[groupIndex].members.includes(currentUser.id)) {
      allGroups[groupIndex].members.push(currentUser.id);
      localStorage.setItem('whisper_chat_groups', JSON.stringify(allGroups));
      loadGroups();
      
      toast({
        title: "Joined group",
        description: `You've joined ${allGroups[groupIndex].name}`,
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'support': return 'bg-green-100 text-green-800';
      case 'study': return 'bg-blue-100 text-blue-800';
      case 'crisis': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Discussion Groups
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Group Name</label>
                  <Input
                    placeholder="Enter group name..."
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe what this group is about..."
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newGroupCategory} onValueChange={(value: any) => setNewGroupCategory(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Discussion</SelectItem>
                      <SelectItem value="support">Support & Help</SelectItem>
                      <SelectItem value="study">Study Group</SelectItem>
                      <SelectItem value="crisis">Crisis Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={createGroup} 
                    disabled={!newGroupName.trim()}
                    className="flex-1"
                  >
                    Create Group
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {groups.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No groups yet. Create or join a group to start discussions.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => (
              <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{group.name}</h4>
                    <Badge className={getCategoryColor(group.category)}>
                      {group.category}
                    </Badge>
                    {group.admins.includes(currentUser?.id || '') && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {group.description}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{group.members.length} members</span>
                    <span>Last active: {new Date(group.lastActivity).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onSelectGroup(group.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                  {group.admins.includes(currentUser?.id || '') && (
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
