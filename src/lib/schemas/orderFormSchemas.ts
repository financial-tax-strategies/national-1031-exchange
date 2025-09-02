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
// Step 1: Contact Information Schema
// ============================================
export const contactInfoSchema = z.object({
  // Use the actual field names that ContactInfoStep populates via backward compatibility
  '1031x_order_first_name': z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  
  '1031x_order_last_name': z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  
  '1031x_order_email': emailSchema,
  
  '1031x_order_phone': z.string()
    .regex(phoneRegex, 'Please enter a valid phone number')
    .transform((val) => {
      // Normalize phone number format
      const digits = val.replace(/\D/g, '');
      if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      }
      return val;
    }),
  
  '1031x_order_preferred_contact': z.enum(['phone', 'email', 'text', 'no_preference']),
  
  // Optional spouse fields (using actual field names from form)
  '1031x_order_spouse_first_name': z.string().optional(),
  '1031x_order_spouse_last_name': z.string().optional(),
  '1031x_order_spouse_email': z.string().email().optional().or(z.literal('')),
  '1031x_order_spouse_phone': z.string().optional(),
  '1031x_order_spouse_mobile_phone': z.string().optional(),
  
  // Optional mailing address (using actual field names from form)
  '1031x_order_seller_mailing_street_address': z.string().optional(),
  '1031x_order_seller_mailing_city': z.string().optional(),
  '1031x_order_seller_mailing_state': z.string().optional(),
  '1031x_order_seller_mailing_zip': z.string().optional(),
  
  // Additional optional fields from ContactInfoStep
  '1031x_order_contact_first_name': z.string().optional(),
  '1031x_order_contact_last_name': z.string().optional(),
  '1031x_order_contact_email': z.string().email().optional().or(z.literal('')),
  '1031x_order_contact_phone': z.string().optional(),
  '1031x_order_contact_mobile_phone': z.string().optional(),
  '1031x_order_contact_country': z.string().optional()
});

// ============================================
// Step 2: Entity/Taxpayer Information Schema
// ============================================
export const entityInfoBaseSchema = z.object({
  // This step only validates that a selection was made
  // Entity is selected -> entity fields are required
  // Individual is selected -> no additional fields required
  '1031x_order_title_held_as_entity': z.string().optional(),
  
  // Entity fields (all optional in base schema)
  '1031x_order_taxpayer_entity_name': z.string().optional(),
  '1031x_order_taxpayer_entity_rep_first_name': z.string().optional(),
  '1031x_order_taxpayer_entity_rep_last_name': z.string().optional(),
  '1031x_order_taxpayer_entity_rep_title': z.string().optional(),
  '1031x_order_taxpayer_ein2': z.string().optional(),
  
  // Individual fields
  '1031_order_entity_type': z.string().optional(),
  '1031_order_entity_name': z.string().optional(),
  '1031_order_entity_ein': z.string().optional()
}).superRefine((data, ctx) => {
  // Only validate entity fields if entity is explicitly selected
  if (data['1031x_order_title_held_as_entity'] === 'entity') {
    if (!data['1031x_order_taxpayer_entity_name'] || data['1031x_order_taxpayer_entity_name'].trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Entity name is required',
        path: ['1031x_order_taxpayer_entity_name']
      });
    }
    if (!data['1031x_order_taxpayer_entity_rep_first_name'] || data['1031x_order_taxpayer_entity_rep_first_name'].trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Representative first name is required',
        path: ['1031x_order_taxpayer_entity_rep_first_name']
      });
    }
    if (!data['1031x_order_taxpayer_entity_rep_last_name'] || data['1031x_order_taxpayer_entity_rep_last_name'].trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Representative last name is required',
        path: ['1031x_order_taxpayer_entity_rep_last_name']
      });
    }
    if (!data['1031x_order_taxpayer_entity_rep_title'] || data['1031x_order_taxpayer_entity_rep_title'].trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Representative title is required',
        path: ['1031x_order_taxpayer_entity_rep_title']
      });
    }
  }
  // If individual is selected or no selection made, validation passes
});

// Export as entityInfoSchema for consistency
export const entityInfoSchema = entityInfoBaseSchema;

// ============================================
// Step 3: Property Details Schema
// ============================================
export const propertyDetailsSchema = z.object({
  '1031x_order_property_address': z.string()
    .min(5, 'Please enter a valid street address')
    .max(100, 'Address is too long'),
  
  '1031x_order_property_city': z.string()
    .min(2, 'Please enter a valid city')
    .max(50, 'City name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Please enter a valid city name'),
  
  '1031x_order_property_state': z.string()
    .length(2, 'Please select a state'),
  
  '1031x_order_property_zip': z.string()
    .regex(zipRegex, 'Please enter a valid ZIP code'),
  
  '1031x_order_property_type': z.enum([
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
  
  '1031x_order_sale_price': z.number()
    .min(10000, 'Sale price must be at least $10,000')
    .max(100000000, 'Sale price seems too high'),
  
  '1031x_order_mortgage_balance': z.number()
    .min(0, 'Mortgage balance cannot be negative')
    .optional()
}).superRefine((data, ctx) => {
  // Cross-field validation: mortgage balance should not exceed sale price
  if (data['1031x_order_mortgage_balance'] && data['1031x_order_sale_price']) {
    if (data['1031x_order_mortgage_balance'] > data['1031x_order_sale_price']) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Mortgage balance cannot exceed sale price',
        path: ['1031x_order_mortgage_balance']
      });
    }
  }
});

// ============================================
// Step 4: Additional Properties Schema (Optional)
// ============================================
export const additionalPropertiesSchema = z.object({
  // Second property fields (all optional as this step is conditional)
  '1031_order_property_address_2': z.string().optional(),
  '1031_order_property_city_2': z.string().optional(),
  '1031_order_property_state_2': z.string().optional(),
  '1031_order_property_zip_2': z.string().optional(),
  '1031_order_property_type_2': z.string().optional(),
  '1031_order_sale_price_2': z.number().optional(),
  '1031_order_mortgage_balance_2': z.number().optional()
});

// ============================================
// Step 5: Timeline Schema
// ============================================
export const timelineSchema = z.object({
  '1031x_order_contract_status': z.enum([
    'not_listed',
    'listed_no_offers',
    'accepted_offer',
    'in_escrow',
    'closing_scheduled'
  ]),
  
  '1031x_order_closing_date': z.string()
    .optional()
    .refine((val) => {
      if (val) {
        const closingDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return closingDate >= today;
      }
      return true;
    }, 'Closing date must be in the future'),
  
  '1031x_order_expected_listing_date': z.string()
    .optional()
    .refine((val) => {
      if (val) {
        const listingDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return listingDate >= today;
      }
      return true;
    }, 'Expected listing date must be in the future'),
  
  '1031x_order_urgency_level': z.enum([
    'planning_3_plus',
    'getting_ready_1_3',
    'time_sensitive_1',
    'urgent_2_weeks'
  ])
}).superRefine((data, ctx) => {
  // Cross-field validation: closing date required for certain statuses
  const status = data['1031x_order_contract_status'];
  if ((status === 'in_escrow' || status === 'closing_scheduled') && !data['1031x_order_closing_date']) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Closing date is required when property is in escrow or closing is scheduled',
      path: ['1031x_order_closing_date']
    });
  }
  
  // Cross-field validation: expected listing date required when not listed
  if (status === 'not_listed' && !data['1031x_order_expected_listing_date']) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Expected listing date is required when property is not yet listed',
      path: ['1031x_order_expected_listing_date']
    });
  }
});

// ============================================
// Step 7: Exchange Goals Schema
// ============================================
export const exchangeGoalsSchema = z.object({
  '1031x_order_replacement_property_identified': z.enum([
    'yes_specific',
    'yes_multiple', 
    'no_searching',
    'need_help'
  ]),
  
  '1031x_order_exchange_type': z.enum([
    'standard_delayed',
    'reverse',
    'improvement',
    'not_sure'
  ]),
  
  '1031x_order_cash_out_amount': z.enum([
    'no_cash',
    'minimal_50k',
    'moderate_50_200k',
    'significant_200k_plus',
    'not_sure'
  ]),
  
  '1031x_order_dst_interest': z.enum([
    'interested',
    'traditional_only',
    'learn_both',
    'not_familiar'
  ])
});

// ============================================
// Step 6: Professional Team Schema
// ============================================
export const professionalTeamSchema = z.object({
  '1031x_order_has_cpa': z.enum(['yes', 'need_referral', 'will_find']),
  
  '1031x_order_cpa_name': z.string()
    .optional(),
  
  '1031x_order_cpa_email': z.string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  
  '1031x_order_realtor_name': z.string()
    .max(100, 'Name is too long')
    .optional(),
  
  '1031x_order_realtor_email': z.string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal(''))
});

// ============================================
// Step 7: Service Preferences Schema
// ============================================
export const servicePreferencesSchema = z.object({
  '1031x_order_contract_preference': z.enum(['electronic', 'mail', 'in_person']),
  
  '1031x_order_consultation_preference': z.enum(['phone', 'video', 'in_person', 'email_only']),
  
  '1031x_order_how_heard': z.enum([
    'google',
    'cpa_referral',
    'realtor_referral',
    'previous_client',
    'social_media',
    'other'
  ]),
  
  '1031x_order_additional_notes': z.string()
    .max(500, 'Please limit your notes to 500 characters')
    .optional()
});

// ============================================
// Step 9: Review Schema
// ============================================
export const reviewSchema = z.object({
  'consent_accuracy': z.boolean().refine(val => val === true, {
    message: 'You must certify that the information is accurate'
  }),
  'consent_contact': z.boolean().refine(val => val === true, {
    message: 'You must authorize us to contact you'
  }),
  'consent_terms': z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  })
});

// ============================================
// Complete Form Schema
// ============================================
// Note: Individual step schemas are used for validation
// Complete schema would need careful composition due to superRefine usage
export const completeOrderFormSchema = z.object({});

// ============================================
// Step Schemas Map
// ============================================
export const stepSchemas = {
  1: contactInfoSchema,
  2: entityInfoSchema,
  3: propertyDetailsSchema,
  4: additionalPropertiesSchema,
  5: timelineSchema,
  6: professionalTeamSchema,
  7: exchangeGoalsSchema,
  8: servicePreferencesSchema,
  9: reviewSchema
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