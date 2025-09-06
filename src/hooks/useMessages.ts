import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/types/supabase'

export const useMessages = (conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (conversationId) {
      fetchMessages()
      
      // Subscribe to real-time updates for this conversation
      const channel = supabase
        .channel(`messages:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            const newMessage = payload.new as Message
            setMessages(prev => [...prev, newMessage])
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          () => {
            fetchMessages()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [conversationId])

  const fetchMessages = async () => {
    try {
      if (!conversationId) return

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:user_profiles(*)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages((data as any) || [])
    } catch (error: any) {
      console.error('Error fetching messages:', error)
      toast({
        title: "Erro ao carregar mensagens",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (
    senderId: string,
    content: string,
    messageType: string = 'text',
    fileUrl?: string
  ) => {
    try {
      if (!conversationId) throw new Error('Conversa não selecionada')

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content,
          message_type: messageType,
          file_url: fileUrl,
        })
        .select(`
          *,
          sender:user_profiles(*)
        `)
        .single()

      if (error) throw error

      // Message will be added via real-time subscription
      return { data, error: null }
    } catch (error: any) {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive",
      })
      return { data: null, error }
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ 
          status: 'lida',
          read_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error('Error marking message as read:', error)
      return { data: null, error }
    }
  }

  return {
    messages,
    loading,
    fetchMessages,
    sendMessage,
    markAsRead
  }
}