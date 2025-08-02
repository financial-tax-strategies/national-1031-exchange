// ============================================
// Order Form Validation Schemas
// National 1031 Center - Zod Schemas
// ============================================

import { z } from 'zod';

// ============================================
// Custom Validation Helpers
// ============================================

// Phone number validation (US format)
const phoneRegex = /^\+?1?\s?(\([0-9]{3}\)|[0-9]{3})[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$/;

// ZIP code validation (5 or 9 digits)
const zipRegex = /^\d{5}(-\d{4})?$/;

// Email validation with common typo prevention
const emailSchema = z.string()
  .email('Please enter a valid email address')
  .refine((email) => {
    // Check for common typos
    const commonTypos = ['gmial.com', 'gmai.com', 'yahooo.com', 'hotmial.com'];
    const domain = email.split('@')[1];
    return !commonTypos.includes(domain);
  }, 'Please check your email address for typos');

// ============================================
// Step 1: Basic Information Schema
// ============================================
export const basicInfoSchema = z.object({
  '1031x_first_name': z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Please enter a valid first name'),
  
  '1031x_last_name': z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Please enter a valid last name'),
  
  '1031x_email': emailSchema,
  
  '1031x_phone': z.string()
    .regex(phoneRegex, 'Please enter a valid phone number')
    .transform((val) => {
      // Normalize phone number format
      const digits = val.replace(/\D/g, '');
      if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      }
      return val;
    }),
  
  '1031x_preferred_contact': z.enum(['phone', 'email', 'text', 'no_preference'])
});

// ============================================
// Step 2: Property Details Schema
// ============================================
export const propertyDetailsSchema = z.object({
  '1031x_property_address': z.string()
    .min(5, 'Please enter a valid street address')
    .max(100, 'Address is too long'),
  
  '1031x_property_city': z.string()
    .min(2, 'Please enter a valid city')
    .max(50, 'City name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Please enter a valid city name'),
  
  '1031x_property_state': z.string()
    .length(2, 'Please select a state'),
  
  '1031x_property_zip': z.string()
    .regex(zipRegex, 'Please enter a valid ZIP code'),
  
  '1031x_property_type': z.enum([
    'single_family_rental',
    'multi_family_2_4',
    'apartment_5_plus',
    'office',
    'retail',
    'industrial',
    'land',
    'mixed_use',
    'other'
  ]),
  
  '1031x_sale_price': z.number()
    .min(10000, 'Sale price must be at least $10,000')
    .max(100000000, 'Sale price seems too high'),
  
  '1031x_mortgage_balance': z.number()
    .min(0, 'Mortgage balance cannot be negative')
    .optional()
    .refine((val, ctx) => {
      // Safety check for ctx.parent
      if (!ctx.parent || !val) {
        return true; // Skip validation if no parent context or no value
      }
      
      const salePrice = ctx.parent['1031x_sale_price'];
      if (salePrice && val > salePrice) {
        return false;
      }
      return true;
    }, 'Mortgage balance cannot exceed sale price')
});

// ============================================
// Step 3: Timeline Schema
// ============================================
export const timelineSchema = z.object({
  '1031x_contract_status': z.enum([
    'not_listed',
    'listed_no_offers',
    'accepted_offer',
    'in_escrow',
    'closing_scheduled'
  ]),
  
  '1031x_closing_date': z.string()
    .optional()
    .refine((val, ctx) => {
      const status = ctx.parent['1031x_contract_status'];
      if ((status === 'in_escrow' || status === 'closing_scheduled') && !val) {
        return false;
      }
      if (val) {
        const closingDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return closingDate >= today;
      }
      return true;
    }, 'Closing date must be in the future'),
  
  '1031x_expected_listing_date': z.string()
    .optional()
    .refine((val, ctx) => {
      const status = ctx.parent['1031x_contract_status'];
      if (status === 'not_listed' && !val) {
        return false;
      }
      if (val) {
        const listingDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return listingDate >= today;
      }
      return true;
    }, 'Expected listing date must be in the future'),
  
  '1031x_urgency_level': z.enum([
    'planning_3_plus',
    'getting_ready_1_3',
    'time_sensitive_1',
    'urgent_2_weeks'
  ])
});

// ============================================
// Step 4: Exchange Goals Schema
// ============================================
export const exchangeGoalsSchema = z.object({
  '1031x_replacement_identified': z.enum([
    'yes_specific',
    'yes_multiple',
    'no_searching',
    'need_help'
  ]),
  
  '1031x_exchange_type': z.enum([
    'standard_delayed',
    'reverse',
    'improvement',
    'not_sure'
  ]),
  
  '1031x_cash_out_needed': z.enum([
    'no_cash',
    'minimal_50k',
    'moderate_50_200k',
    'significant_200k_plus',
    'not_sure'
  ]),
  
  '1031x_dst_interest': z.enum([
    'interested',
    'traditional_only',
    'learn_both',
    'not_familiar'
  ])
});

// ============================================
// Step 5: Professional Team Schema
// ============================================
export const professionalTeamSchema = z.object({
  '1031x_has_cpa': z.enum(['yes', 'need_referral', 'will_find']),
  
  '1031x_cpa_name': z.string()
    .optional()
    .refine((val, ctx) => {
      const hasCPA = ctx.parent['1031x_has_cpa'];
      if (hasCPA === 'yes' && !val) {
        return false;
      }
      return true;
    }, 'Please provide your CPA\'s name'),
  
  '1031x_cpa_email': z.string()
    .optional()
    .refine((val, ctx) => {
      const hasCPA = ctx.parent['1031x_has_cpa'];
      if (hasCPA === 'yes' && val && !z.string().email().safeParse(val).success) {
        return false;
      }
      return true;
    }, 'Please enter a valid email address'),
  
  '1031x_realtor_name': z.string()
    .max(100, 'Name is too long')
    .optional(),
  
  '1031x_realtor_email': z.string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal(''))
});

// ============================================
// Step 6: Service Preferences Schema
// ============================================
export const servicePreferencesSchema = z.object({
  '1031x_contract_preference': z.enum(['electronic', 'mail', 'in_person']),
  
  '1031x_consultation_preference': z.enum(['phone', 'video', 'in_person', 'email_only']),
  
  '1031x_how_heard': z.enum([
    'google',
    'cpa_referral',
    'realtor_referral',
    'previous_client',
    'social_media',
    'other'
  ]),
  
  '1031x_additional_notes': z.string()
    .max(500, 'Please limit your notes to 500 characters')
    .optional()
});

// ============================================
// Complete Form Schema
// ============================================
export const completeOrderFormSchema = basicInfoSchema
  .merge(propertyDetailsSchema)
  .merge(timelineSchema)
  .merge(exchangeGoalsSchema)
  .merge(professionalTeamSchema)
  .merge(servicePreferencesSchema);

// ============================================
// Step Schemas Map
// ============================================
export const stepSchemas = {
  1: basicInfoSchema,
  2: propertyDetailsSchema,
  3: timelineSchema,
  4: exchangeGoalsSchema,
  5: professionalTeamSchema,
  6: servicePreferencesSchema
} as const;

// ============================================
// Validation Helper
// ============================================
export function validateStep(step: number, data: any) {
  const schema = stepSchemas[step as keyof typeof stepSchemas];
  if (!schema) {
    throw new Error(`Invalid step number: ${step}`);
  }
  
  return schema.safeParse(data);
}