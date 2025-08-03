-- Create order_form_submissions table
CREATE TABLE IF NOT EXISTS order_form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information (Step 1)
  "1031x_order_first_name" TEXT NOT NULL,
  "1031x_order_last_name" TEXT NOT NULL,
  "1031x_order_email" TEXT NOT NULL,
  "1031x_order_phone" TEXT NOT NULL,
  "1031x_order_preferred_contact" TEXT CHECK ("1031x_order_preferred_contact" IN ('phone', 'email', 'text', 'no_preference')),
  
  -- Property Details (Step 2)
  "1031x_order_property_address" TEXT NOT NULL,
  "1031x_order_property_city" TEXT NOT NULL,
  "1031x_order_property_state" TEXT NOT NULL,
  "1031x_order_property_zip" TEXT NOT NULL,
  "1031x_order_property_type" TEXT NOT NULL CHECK ("1031x_order_property_type" IN (
    'single_family_rental', 'multi_family_2_4', 'apartment_5_plus', 
    'office', 'retail', 'industrial', 'land', 'mixed_use', 'other'
  )),
  "1031x_order_sale_price" NUMERIC NOT NULL CHECK ("1031x_order_sale_price" >= 10000),
  "1031x_order_mortgage_balance" NUMERIC,
  
  -- Timeline (Step 3)
  "1031x_order_contract_status" TEXT NOT NULL CHECK ("1031x_order_contract_status" IN (
    'not_listed', 'listed_no_offers', 'accepted_offer', 'in_escrow', 'closing_scheduled'
  )),
  "1031x_order_closing_date" DATE,
  "1031x_order_expected_listing_date" DATE,
  "1031x_order_urgency_level" TEXT NOT NULL CHECK ("1031x_order_urgency_level" IN (
    'planning_3_plus', 'getting_ready_1_3', 'time_sensitive_1', 'urgent_2_weeks'
  )),
  
  -- Exchange Goals (Step 4)
  "1031x_order_replacement_identified" TEXT NOT NULL CHECK ("1031x_order_replacement_identified" IN (
    'yes_specific', 'yes_multiple', 'no_searching', 'need_help'
  )),
  "1031x_order_exchange_type" TEXT NOT NULL CHECK ("1031x_order_exchange_type" IN (
    'standard_delayed', 'reverse', 'improvement', 'not_sure'
  )),
  "1031x_order_cash_out_needed" TEXT NOT NULL CHECK ("1031x_order_cash_out_needed" IN (
    'no_cash', 'minimal_50k', 'moderate_50_200k', 'significant_200k_plus', 'not_sure'
  )),
  "1031x_order_dst_interest" TEXT NOT NULL CHECK ("1031x_order_dst_interest" IN (
    'interested', 'traditional_only', 'learn_both', 'not_familiar'
  )),
  
  -- Professional Team (Step 5)
  "1031x_order_has_cpa" TEXT NOT NULL CHECK ("1031x_order_has_cpa" IN ('yes', 'need_referral', 'will_find')),
  "1031x_order_cpa_name" TEXT,
  "1031x_order_cpa_email" TEXT,
  "1031x_order_realtor_name" TEXT,
  "1031x_order_realtor_email" TEXT,
  
  -- Service Preferences (Step 6)
  "1031x_order_contract_preference" TEXT NOT NULL CHECK ("1031x_order_contract_preference" IN ('electronic', 'mail', 'in_person')),
  "1031x_order_consultation_preference" TEXT NOT NULL CHECK ("1031x_order_consultation_preference" IN ('phone', 'video', 'in_person', 'email_only')),
  "1031x_order_how_heard" TEXT NOT NULL CHECK ("1031x_order_how_heard" IN (
    'google', 'cpa_referral', 'realtor_referral', 'previous_client', 'social_media', 'other'
  )),
  "1031x_order_additional_notes" TEXT,
  
  -- Metadata
  highlevel_contact_id TEXT,
  lead_score INTEGER DEFAULT 0,
  submission_date TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  form_completion_time_seconds INTEGER,
  
  -- Email tracking
  admin_notification_sent BOOLEAN DEFAULT FALSE,
  admin_notification_sent_at TIMESTAMPTZ,
  user_confirmation_sent BOOLEAN DEFAULT FALSE,
  user_confirmation_sent_at TIMESTAMPTZ,
  
  -- Webhook tracking
  webhook_sent BOOLEAN DEFAULT FALSE,
  webhook_sent_at TIMESTAMPTZ,
  webhook_response TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'processing', 'synced', 'error')),
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_order_form_email ON order_form_submissions("1031x_order_email");
CREATE INDEX idx_order_form_status ON order_form_submissions(status);
CREATE INDEX idx_order_form_urgency ON order_form_submissions("1031x_order_urgency_level");
CREATE INDEX idx_order_form_created ON order_form_submissions(created_at DESC);
CREATE INDEX idx_order_form_lead_score ON order_form_submissions(lead_score DESC);

-- Create function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_order_form_lead_score(
  urgency_level TEXT,
  sale_price NUMERIC,
  contract_status TEXT,
  replacement_identified TEXT,
  has_cpa TEXT
) RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Urgency scoring (0-40 points)
  CASE urgency_level
    WHEN 'urgent_2_weeks' THEN score := score + 40;
    WHEN 'time_sensitive_1' THEN score := score + 30;
    WHEN 'getting_ready_1_3' THEN score := score + 20;
    WHEN 'planning_3_plus' THEN score := score + 10;
  END CASE;
  
  -- Sale price scoring (0-30 points)
  IF sale_price >= 5000000 THEN
    score := score + 30;
  ELSIF sale_price >= 2000000 THEN
    score := score + 25;
  ELSIF sale_price >= 1000000 THEN
    score := score + 20;
  ELSIF sale_price >= 500000 THEN
    score := score + 15;
  ELSIF sale_price >= 250000 THEN
    score := score + 10;
  ELSE
    score := score + 5;
  END IF;
  
  -- Contract status scoring (0-20 points)
  CASE contract_status
    WHEN 'closing_scheduled' THEN score := score + 20;
    WHEN 'in_escrow' THEN score := score + 18;
    WHEN 'accepted_offer' THEN score := score + 15;
    WHEN 'listed_no_offers' THEN score := score + 10;
    WHEN 'not_listed' THEN score := score + 5;
  END CASE;
  
  -- Replacement property scoring (0-10 points)
  CASE replacement_identified
    WHEN 'yes_specific' THEN score := score + 10;
    WHEN 'yes_multiple' THEN score := score + 8;
    WHEN 'no_searching' THEN score := score + 5;
    WHEN 'need_help' THEN score := score + 3;
  END CASE;
  
  -- Has CPA bonus
  IF has_cpa = 'yes' THEN
    score := score + 5;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update lead score
CREATE OR REPLACE FUNCTION update_order_form_lead_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.lead_score := calculate_order_form_lead_score(
    NEW."1031x_order_urgency_level",
    NEW."1031x_order_sale_price",
    NEW."1031x_order_contract_status",
    NEW."1031x_order_replacement_identified",
    NEW."1031x_order_has_cpa"
  );
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_form_lead_score_trigger
BEFORE INSERT OR UPDATE ON order_form_submissions
FOR EACH ROW EXECUTE FUNCTION update_order_form_lead_score();

-- Create webhook logs table
CREATE TABLE IF NOT EXISTS order_form_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_form_id UUID REFERENCES order_form_submissions(id),
  webhook_type TEXT NOT NULL,
  url TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  attempt_count INTEGER DEFAULT 1,
  success BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_order_form ON order_form_webhooks(order_form_id);
CREATE INDEX idx_webhook_success ON order_form_webhooks(success);

-- Create email logs table
CREATE TABLE IF NOT EXISTS order_form_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_form_id UUID REFERENCES order_form_submissions(id),
  email_type TEXT NOT NULL CHECK (email_type IN ('admin_notification', 'user_confirmation')),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_order_form ON order_form_emails(order_form_id);
CREATE INDEX idx_email_sent ON order_form_emails(sent);

-- Add RLS policies
ALTER TABLE order_form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_form_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_form_emails ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role can do everything" ON order_form_submissions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON order_form_webhooks
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON order_form_emails
  FOR ALL USING (auth.role() = 'service_role');

-- Allow anonymous inserts only (for form submissions)
CREATE POLICY "Anonymous can insert" ON order_form_submissions
  FOR INSERT WITH CHECK (true);