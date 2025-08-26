import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export type UserRole = 'paciente' | 'atendente' | 'gerente'
export type MessageStatus = 'enviada' | 'entregue' | 'lida' | 'respondida'
export type ChannelType = 'whatsapp' | 'instagram' | 'facebook' | 'email' | 'site'
export type ConversationStatus = 'aberta' | 'aguardando' | 'finalizada'

export interface UserProfile {
  id: string
  role: UserRole
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  birth_date: string | null
  cpf: string | null
  emergency_contact: string | null
  medical_history: string | null
  user_profile?: UserProfile
}

export interface Attendant {
  id: string
  employee_id: string | null
  department: string | null
  is_online: boolean
  last_activity: string
  user_profile?: UserProfile
}

export interface Conversation {
  id: string
  patient_id: string
  attendant_id: string | null
  channel: ChannelType
  status: ConversationStatus
  subject: string | null
  priority: number
  started_at: string
  last_message_at: string
  closed_at: string | null
  rating: number | null
  feedback: string | null
  patient?: Patient
  attendant?: Attendant
  messages?: Message[]
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: string
  file_url: string | null
  status: MessageStatus
  read_at: string | null
  created_at: string
  sender?: UserProfile
}

export interface Appointment {
  id: string
  patient_id: string
  doctor_name: string
  specialty: string
  scheduled_date: string
  scheduled_time: string
  duration_minutes: number
  status: string
  notes: string | null
  reminder_sent: boolean
  patient?: Patient
}

export interface QuickReply {
  id: string
  attendant_id: string
  title: string
  content: string
  is_global: boolean
  usage_count: number
}

export interface PerformanceMetric {
  id: string
  attendant_id: string
  date: string
  conversations_handled: number
  avg_response_time_seconds: number
  customer_satisfaction_avg: number
  messages_sent: number
  attendant?: Attendant
}