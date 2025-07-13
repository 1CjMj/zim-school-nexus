import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  read: boolean | null;
  created_at: string | null;
  // Joined data
  sender_name?: string;
  recipient_name?: string;
}

export interface MessageInput {
  recipient_id: string;
  subject: string;
  content: string;
}

export const useMessages = (userId?: string, type: 'inbox' | 'sent' = 'inbox') => {
  return useQuery({
    queryKey: ['messages', userId, type],
    queryFn: async () => {
      if (!userId) return [];

      const isInbox = type === 'inbox';
      const userField = isInbox ? 'recipient_id' : 'sender_id';
      const joinField = isInbox ? 'sender_id' : 'recipient_id';

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name),
          recipient:profiles!messages_recipient_id_fkey(full_name)
        `)
        .eq(userField, userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((message: any) => ({
        ...message,
        sender_name: message.sender?.full_name,
        recipient_name: message.recipient?.full_name
      })) as Message[];
    },
    enabled: !!userId
  });
};

export const useUnreadCount = (userId?: string) => {
  return useQuery({
    queryKey: ['messages', 'unread', userId],
    queryFn: async () => {
      if (!userId) return 0;

      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId
  });
};

export const useMessageStats = (userId?: string) => {
  return useQuery({
    queryKey: ['messages', 'stats', userId],
    queryFn: async () => {
      if (!userId) return { total: 0, unread: 0, sent: 0, highPriority: 0 };

      // Get unread count
      const { count: unreadCount, error: unreadError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', userId)
        .eq('read', false);

      if (unreadError) throw unreadError;

      // Get total received count
      const { count: totalCount, error: totalError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', userId);

      if (totalError) throw totalError;

      // Get sent count
      const { count: sentCount, error: sentError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', userId);

      if (sentError) throw sentError;

      return {
        total: totalCount || 0,
        unread: unreadCount || 0,
        sent: sentCount || 0,
        highPriority: 0 // Placeholder since we don't have priority field yet
      };
    },
    enabled: !!userId
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ senderId, messageData }: { senderId: string; messageData: MessageInput }) => {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: senderId,
          ...messageData
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: 'Message sent successfully',
        description: 'Your message has been delivered.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error sending message',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: 'Message deleted successfully',
        description: 'The message has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting message',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};