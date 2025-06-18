
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Reply, Forward, Archive, Trash2, Paperclip } from 'lucide-react';

const Messages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const messages = [
    {
      id: '1',
      from: 'Mrs. Chipo Mutendi',
      to: 'me',
      subject: 'Form 4A Mathematics Test Results',
      preview: 'The recent mathematics test results are ready for review...',
      content: 'Dear Colleague,\n\nI hope this message finds you well. I wanted to share the results of the recent Form 4A mathematics test. Overall, the class performed well with an average of 78%. However, I noticed that some students are struggling with quadratic equations...',
      timestamp: '2 hours ago',
      isRead: false,
      hasAttachment: true,
      priority: 'normal'
    },
    {
      id: '2',
      from: 'Mr. James Moyo',
      to: 'me',
      subject: 'Parent-Teacher Conference Request',
      preview: 'I would like to schedule a meeting to discuss Tatenda\'s progress...',
      content: 'Dear Teacher,\n\nI hope you are doing well. I am writing to request a parent-teacher conference to discuss my son Tatenda\'s academic progress. I have noticed some changes in his study habits and would appreciate your insights...',
      timestamp: '1 day ago',
      isRead: true,
      hasAttachment: false,
      priority: 'high'
    },
    {
      id: '3',
      from: 'Principal Mukamuri',
      to: 'All Staff',
      subject: 'Staff Meeting - Term 2 Planning',
      preview: 'Mandatory staff meeting scheduled for Friday at 3:00 PM...',
      content: 'Dear Staff Members,\n\nWe will be holding a mandatory staff meeting this Friday at 3:00 PM in the main conference room. We will discuss term 2 planning, upcoming events, and new policies...',
      timestamp: '3 days ago',
      isRead: true,
      hasAttachment: true,
      priority: 'normal'
    }
  ];

  const sentMessages = [
    {
      id: '4',
      from: 'me',
      to: 'Mrs. Grace Sibanda',
      subject: 'Student Fee Payment Reminder',
      preview: 'Gentle reminder about outstanding fees for Form 3B students...',
      timestamp: '1 week ago',
      isRead: true
    }
  ];

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

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">24</CardTitle>
            <CardDescription>Unread Messages</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">156</CardTitle>
            <CardDescription>Total Messages</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">12</CardTitle>
            <CardDescription>Sent Today</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">3</CardTitle>
            <CardDescription>High Priority</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Message List */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="inbox" className="space-y-4">
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
              {messages.map((message) => (
                <Card 
                  key={message.id} 
                  className={`cursor-pointer hover:bg-accent transition-colors ${!message.isRead ? 'border-blue-500' : ''}`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {message.from.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium truncate ${!message.isRead ? 'font-bold' : ''}`}>
                            {message.from}
                          </p>
                          <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!message.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                        {message.hasAttachment && <Paperclip className="h-3 w-3 text-muted-foreground" />}
                        {message.priority === 'high' && <Badge variant="destructive" className="text-xs">!</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className={`text-sm mb-1 ${!message.isRead ? 'font-semibold' : ''}`}>
                      {message.subject}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {message.preview}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="sent" className="space-y-2">
              {sentMessages.map((message) => (
                <Card key={message.id} className="cursor-pointer hover:bg-accent transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {message.to.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">To: {message.to}</p>
                          <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm mb-1">{message.subject}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {message.preview}
                    </p>
                  </CardContent>
                </Card>
              ))}
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
                          {selectedMessage.from.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{selectedMessage.from}</p>
                        <p className="text-xs text-muted-foreground">
                          to {selectedMessage.to} • {selectedMessage.timestamp}
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
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
                {selectedMessage.hasAttachment && (
                  <div className="mt-4 p-3 bg-accent rounded-lg">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      <span className="text-sm">test_results.pdf</span>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        Download
                      </Button>
                    </div>
                  </div>
                )}
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
