-- Fix foreign key relationships and add missing tables
-- First, add missing foreign keys to existing tables
ALTER TABLE conversations 
ADD CONSTRAINT fk_conversations_patient_id 
FOREIGN KEY (patient_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE conversations 
ADD CONSTRAINT fk_conversations_attendant_id 
FOREIGN KEY (attendant_id) REFERENCES user_profiles(id) ON DELETE SET NULL;

ALTER TABLE messages 
ADD CONSTRAINT fk_messages_conversation_id 
FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

ALTER TABLE messages 
ADD CONSTRAINT fk_messages_sender_id 
FOREIGN KEY (sender_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE appointments 
ADD CONSTRAINT fk_appointments_patient_id 
FOREIGN KEY (patient_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Create medical results table
CREATE TABLE medical_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  exam_type TEXT NOT NULL,
  exam_date DATE NOT NULL,
  result_summary TEXT,
  file_url TEXT,
  doctor_name TEXT,
  status TEXT NOT NULL DEFAULT 'disponivel',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_medical_results_patient_id 
    FOREIGN KEY (patient_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Enable RLS for medical_results
ALTER TABLE medical_results ENABLE ROW LEVEL SECURITY;

-- Create policies for medical_results
CREATE POLICY "Patients can view their own results" 
ON medical_results 
FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Staff can view all results" 
ON medical_results 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND role IN ('atendente', 'gerente')
));

CREATE POLICY "Staff can create results" 
ON medical_results 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND role IN ('atendente', 'gerente')
));

-- Add update trigger for medical_results
CREATE TRIGGER update_medical_results_updated_at
BEFORE UPDATE ON medical_results
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample medical results for testing
INSERT INTO medical_results (patient_id, exam_type, exam_date, result_summary, doctor_name) 
SELECT 
  id, 
  'Hemograma Completo', 
  CURRENT_DATE - INTERVAL '7 days',
  'Resultados dentro da normalidade. Todos os valores estão adequados.',
  'Dr. Silva'
FROM user_profiles 
WHERE role = 'paciente'
LIMIT 3;

INSERT INTO medical_results (patient_id, exam_type, exam_date, result_summary, doctor_name) 
SELECT 
  id, 
  'Raio-X Tórax', 
  CURRENT_DATE - INTERVAL '14 days',
  'Exame sem alterações significativas. Pulmões limpos.',
  'Dr. Costa'
FROM user_profiles 
WHERE role = 'paciente'
LIMIT 2;