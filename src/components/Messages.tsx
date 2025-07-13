
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Reply, Forward, Archive, Trash2, Paperclip } from 'lucide-react';
import { useMessages, useMessageStats, useMarkAsRead, useDeleteMessage } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';

const Messages = () => {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('inbox');
  const { user } = useAuth();

  // Fetch messages based on active tab
  const { data: inboxMessages = [], isLoading: inboxLoading } = useMessages(user?.id, 'inbox');
  const { data: sentMessages = [], isLoading: sentLoading } = useMessages(user?.id, 'sent');
  const { data: stats } = useMessageStats(user?.id);
  const markAsRead = useMarkAsRead();
  const deleteMessage = useDeleteMessage();

  const isLoading = inboxLoading || sentLoading;

  const handleMessageSelect = async (message: any) => {
    setSelectedMessage(message);
    
    // Mark message as read if it's unread and from inbox
    if (!message.read && activeTab === 'inbox') {
      try {
        await markAsRead.mutateAsync(message.id);
      } catch (error) {
        console.error('Failed to mark message as read:', error);
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage.mutateAsync(messageId);
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const getCurrentMessages = () => {
    const messages = activeTab === 'sent' ? sentMessages : inboxMessages;
    
    if (!searchQuery) return messages;
    
    return messages.filter(message => 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">Communicate with students, parents, and staff</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Compose Message
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-8 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{stats?.unread || 0}</CardTitle>
              <CardDescription>Unread Messages</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{stats?.total || 0}</CardTitle>
              <CardDescription>Total Messages</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{stats?.sent || 0}</CardTitle>
              <CardDescription>Sent Messages</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{stats?.highPriority || 0}</CardTitle>
              <CardDescription>High Priority</CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Message List */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="inbox" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <TabsContent value="inbox" className="space-y-2">
              {getCurrentMessages().length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      {inboxMessages.length === 0 ? 'No messages in inbox.' : 'No messages match your search.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                getCurrentMessages().map((message) => (
                  <Card 
                    key={message.id} 
                    className={`cursor-pointer hover:bg-accent transition-colors ${!message.read ? 'border-blue-500' : ''}`}
                    onClick={() => handleMessageSelect(message)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {message.sender_name?.split(' ').map(n => n[0]).join('') || 'S'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-medium truncate ${!message.read ? 'font-bold' : ''}`}>
                              {message.sender_name || 'Unknown Sender'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTimeAgo(message.created_at || '')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!message.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className={`text-sm mb-1 ${!message.read ? 'font-semibold' : ''}`}>
                        {message.subject}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {message.content.substring(0, 100)}...
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="sent" className="space-y-2">
              {getCurrentMessages().length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      {sentMessages.length === 0 ? 'No sent messages.' : 'No messages match your search.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                getCurrentMessages().map((message) => (
                  <Card key={message.id} className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => setSelectedMessage(message)}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {message.recipient_name?.split(' ').map(n => n[0]).join('') || 'R'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">To: {message.recipient_name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatTimeAgo(message.created_at || '')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm mb-1">{message.subject}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {message.content.substring(0, 100)}...
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="archived">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No archived messages</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Message Content */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {selectedMessage.sender_name?.split(' ').map(n => n[0]).join('') || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{selectedMessage.sender_name || 'Unknown Sender'}</p>
                        <p className="text-xs text-muted-foreground">
                          to {selectedMessage.recipient_name || 'Unknown'} • {formatTimeAgo(selectedMessage.created_at || '')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Forward className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      disabled={deleteMessage.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
                <div className="mt-6 border-t pt-4">
                  <Textarea 
                    placeholder="Type your reply..." 
                    className="min-h-[100px]"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach File
                    </Button>
                    <Button>Send Reply</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <p>Select a message to view its content</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
