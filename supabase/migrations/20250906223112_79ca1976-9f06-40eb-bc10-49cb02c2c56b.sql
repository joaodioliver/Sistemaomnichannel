-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('paciente', 'atendente', 'gerente')),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  birth_date DATE,
  cpf TEXT,
  emergency_contact TEXT,
  medical_history TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendants table
CREATE TABLE public.attendants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT,
  department TEXT,
  is_online BOOLEAN NOT NULL DEFAULT false,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  attendant_id UUID,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'instagram', 'facebook', 'email', 'site')),
  status TEXT NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta', 'aguardando', 'finalizada')),
  subject TEXT,
  priority INTEGER NOT NULL DEFAULT 1,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_message_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'enviada' CHECK (status IN ('enviada', 'entregue', 'lida', 'respondida')),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  doctor_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'agendado',
  notes TEXT,
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quick_replies table
CREATE TABLE public.quick_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attendant_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_global BOOLEAN NOT NULL DEFAULT false,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create performance_metrics table
CREATE TABLE public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attendant_id UUID NOT NULL,
  date DATE NOT NULL,
  conversations_handled INTEGER NOT NULL DEFAULT 0,
  avg_response_time_seconds INTEGER NOT NULL DEFAULT 0,
  customer_satisfaction_avg DECIMAL(3,2) NOT NULL DEFAULT 0.0,
  messages_sent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable insert for authentication" ON public.user_profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Patients can view their own data" ON public.patients FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Patients can update their own data" ON public.patients FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable insert for patients" ON public.patients FOR INSERT WITH CHECK (true);

CREATE POLICY "Attendants can view their own data" ON public.attendants FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Attendants can update their own data" ON public.attendants FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable insert for attendants" ON public.attendants FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view conversations where they participate" ON public.conversations 
FOR SELECT USING (
  auth.uid() = patient_id OR 
  auth.uid() = attendant_id OR 
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'gerente')
);

CREATE POLICY "Patients can create conversations" ON public.conversations 
FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Attendants and managers can update conversations" ON public.conversations 
FOR UPDATE USING (
  auth.uid() = attendant_id OR 
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('atendente', 'gerente'))
);

CREATE POLICY "Users can view messages in their conversations" ON public.messages 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id AND (patient_id = auth.uid() OR attendant_id = auth.uid())
  ) OR 
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'gerente')
);

CREATE POLICY "Users can create messages in their conversations" ON public.messages 
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id AND (patient_id = auth.uid() OR attendant_id = auth.uid())
  )
);

CREATE POLICY "Users can update their own messages" ON public.messages 
FOR UPDATE USING (auth.uid() = sender_id);

CREATE POLICY "Patients can view their appointments" ON public.appointments 
FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create their appointments" ON public.appointments 
FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Staff can view all appointments" ON public.appointments 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('atendente', 'gerente'))
);

CREATE POLICY "Attendants can view their quick replies" ON public.quick_replies 
FOR SELECT USING (
  auth.uid() = attendant_id OR is_global = true OR
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'gerente')
);

CREATE POLICY "Attendants can manage their quick replies" ON public.quick_replies 
FOR ALL USING (auth.uid() = attendant_id);

CREATE POLICY "Attendants can view their performance metrics" ON public.performance_metrics 
FOR SELECT USING (
  auth.uid() = attendant_id OR
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'gerente')
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_attendants_updated_at BEFORE UPDATE ON public.attendants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quick_replies_updated_at BEFORE UPDATE ON public.quick_replies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_performance_metrics_updated_at BEFORE UPDATE ON public.performance_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();