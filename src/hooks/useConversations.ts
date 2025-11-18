import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Conversation, Message } from '@/types/supabase'

export const useConversations = (userRole?: string, userId?: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (userId) {
      fetchConversations()
      
      // Subscribe to real-time updates
      const channel = supabase
        .channel('conversations')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'conversations',
          },
          () => {
            fetchConversations()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [userId, userRole])

  const fetchConversations = async () => {
    try {
      if (!userId) return

      let query = supabase
        .from('conversations')
        .select(`
          *,
          patient:patients(
            *,
            user_profile:user_profiles(*)
          ),
          attendant:attendants(
            *,
            user_profile:user_profiles(*)
          ),
          messages(
            *,
            sender:user_profiles(*)
          )
        `)
        .order('last_message_at', { ascending: false })

      // Filter based on user role
      if (userRole === 'paciente') {
        query = query.eq('patient_id', userId)
      } else if (userRole === 'atendente') {
        query = query.or(`attendant_id.eq.${userId},attendant_id.is.null`)
      }
      // Managers can see all conversations (no filter)

      const { data, error } = await query

      if (error) throw error
      setConversations((data as any) || [])
    } catch (error: any) {
      console.error('Error fetching conversations:', error)
      toast({
        title: "Erro ao carregar conversas",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createConversation = async (
    patientId: string,
    channel: string,
    subject?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          patient_id: patientId,
          channel,
          subject,
          status: 'aberta'
        })
        .select()
        .single()

      if (error) throw error

      // Enviar mensagem automática de boas-vindas do bot
      const botMessage = `Olá! 👋 Bem-vindo ao nosso sistema de atendimento.\n\nSou um assistente virtual e já registrei sua solicitação. Um de nossos atendentes irá responder em breve.\n\nEnquanto aguarda, sinta-se à vontade para descrever sua necessidade com mais detalhes.`;
      
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: data.id,
          sender_id: patientId, // Bot usa o ID do sistema
          content: botMessage,
          message_type: 'text',
          status: 'entregue'
        })

      if (messageError) {
        console.error('Error sending bot message:', messageError)
      }

      toast({
        title: "Conversa iniciada!",
        description: "Nova conversa criada com sucesso",
      })

      await fetchConversations()
      return { data, error: null }
    } catch (error: any) {
      toast({
        title: "Erro ao criar conversa",
        description: error.message,
        variant: "destructive",
      })
      return { data: null, error }
    }
  }

  const assignConversation = async (conversationId: string, attendantId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .update({ attendant_id: attendantId })
        .eq('id', conversationId)
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Conversa atribuída!",
        description: "Conversa atribuída ao atendente com sucesso",
      })

      await fetchConversations()
      return { data, error: null }
    } catch (error: any) {
      toast({
        title: "Erro ao atribuir conversa",
        description: error.message,
        variant: "destructive",
      })
      return { data: null, error }
    }
  }

  const closeConversation = async (conversationId: string, rating?: number, feedback?: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .update({ 
          status: 'finalizada',
          closed_at: new Date().toISOString(),
          rating,
          feedback
        })
        .eq('id', conversationId)
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Conversa finalizada!",
        description: "Conversa finalizada com sucesso",
      })

      await fetchConversations()
      return { data, error: null }
    } catch (error: any) {
      toast({
        title: "Erro ao finalizar conversa",
        description: error.message,
        variant: "destructive",
      })
      return { data: null, error }
    }
  }

  return {
    conversations,
    loading,
    fetchConversations,
    createConversation,
    assignConversation,
    closeConversation
  }
}