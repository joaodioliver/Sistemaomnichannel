-- Add foreign key relationships
ALTER TABLE conversations 
ADD CONSTRAINT fk_conversations_patient 
FOREIGN KEY (patient_id) REFERENCES user_profiles(id);

ALTER TABLE conversations 
ADD CONSTRAINT fk_conversations_attendant 
FOREIGN KEY (attendant_id) REFERENCES user_profiles(id);

ALTER TABLE messages 
ADD CONSTRAINT fk_messages_conversation 
FOREIGN KEY (conversation_id) REFERENCES conversations(id);

ALTER TABLE messages 
ADD CONSTRAINT fk_messages_sender 
FOREIGN KEY (sender_id) REFERENCES user_profiles(id);

ALTER TABLE appointments 
ADD CONSTRAINT fk_appointments_patient 
FOREIGN KEY (patient_id) REFERENCES user_profiles(id);

ALTER TABLE quick_replies 
ADD CONSTRAINT fk_quick_replies_attendant 
FOREIGN KEY (attendant_id) REFERENCES user_profiles(id);

ALTER TABLE performance_metrics 
ADD CONSTRAINT fk_performance_metrics_attendant 
FOREIGN KEY (attendant_id) REFERENCES user_profiles(id);