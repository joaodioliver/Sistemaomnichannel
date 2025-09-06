import { Tables } from '@/integrations/supabase/types'

// Types for the omnichannel system
export type UserRole = 'paciente' | 'atendente' | 'gerente'
export type MessageStatus = 'enviada' | 'entregue' | 'lida' | 'respondida'
export type ChannelType = 'whatsapp' | 'instagram' | 'facebook' | 'email' | 'site'
export type ConversationStatus = 'aberta' | 'aguardando' | 'finalizada'

// Base types from Supabase
export type UserProfile = Tables<'user_profiles'> & {
  role: UserRole
}

export type Patient = Tables<'patients'> & {
  user_profile?: UserProfile
}

export type Attendant = Tables<'attendants'> & {
  user_profile?: UserProfile
}

export type Conversation = Tables<'conversations'> & {
  channel: ChannelType
  status: ConversationStatus
  patient?: Patient
  attendant?: Attendant
  messages?: Message[]
}

export type Message = Tables<'messages'> & {
  status: MessageStatus
  sender?: UserProfile
}

export type Appointment = Tables<'appointments'> & {
  patient?: Patient
}

export type QuickReply = Tables<'quick_replies'>

export type PerformanceMetric = Tables<'performance_metrics'> & {
  attendant?: Attendant
}