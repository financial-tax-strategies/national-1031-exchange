-- Fix: Make lead_id column nullable in order_form_submissions table
-- This allows form submissions to be saved without requiring a lead record
ALTER TABLE order_form_submissions 
ALTER COLUMN lead_id DROP NOT NULL;