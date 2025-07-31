# Analytics Implementation Guide

## Overview

The National 1031 Center website includes comprehensive analytics tracking using Google Analytics 4 and Google Tag Manager, with additional support for HighLevel CRM integration.

## Analytics Components

### 1. Google Analytics 4 (GA4)
- **File**: `src/components/analytics/GoogleAnalytics.astro`
- **Environment Variable**: `PUBLIC_GA_MEASUREMENT_ID`
- **Default ID**: `G-XXXXXXXXXX` (placeholder)

### 2. Google Tag Manager (GTM)
- **File**: `src/components/analytics/GoogleTagManager.astro`
- **Environment Variable**: `PUBLIC_GTM_ID`
- **Default ID**: `GTM-XXXXXXX` (placeholder)

## Event Tracking

### Calculator Events
- **calculator_start**: Fired when user first interacts with calculator
- **calculator_complete**: Fired when calculation is completed (includes tax savings value)
- **generate_lead**: Fired when user submits contact information

### Booking Flow Events
- **booking_flow_started**: Booking flow initiated from calculator
- **booking_date_selected**: User selects appointment date
- **booking_time_selected**: User selects time slot
- **booking_confirmed**: User confirms appointment details
- **appointment_created**: Appointment created in HighLevel
- **appointment_assigned**: Specialist assigned to appointment
- **booking_completed**: Full booking flow completed successfully
- **booking_error**: Error occurred during booking process
- **booking_abandoned**: User abandoned booking flow
- **availability_loaded**: Availability data loaded (performance tracking)
- **booking_submission_performance**: Booking submission performance metrics

### Content Engagement Events
- **cta_click**: All call-to-action button clicks
  - `hero_start_exchange`: Hero section "Start Your Exchange Today"
  - `hero_calculator`: Hero section "Calculate Your Savings"
  - `bottom_consultation`: Bottom section "Get Free Consultation"
  - `bottom_calculator`: Bottom section "Calculate Savings"
  - `calculator_start_exchange`: Calculator results "Start My 1031 Exchange"

### Service Page Events
- **service_click**: Service page navigation
  - `delayed_exchange`: Delayed Exchange service page
  - `reverse_exchange`: Reverse Exchange service page
  - `improvement_exchange`: Improvement Exchange service page
  - `partial_exchange`: Partial Exchange service page

### Phone Call Events
- **phone_call**: Phone number clicks
  - `footer`: Footer phone number
  - `bottom_cta`: Bottom CTA section phone number

### Form Events
- **form_start**: Form interaction begins
- **form_submit**: Form submission completed
- **form_interaction**: Individual form field interactions

### HighLevel CRM Events
- **highlevel_lead_captured**: Lead captured with HighLevel data
- **lead_captured**: Enhanced ecommerce event for lead value tracking
- **calculator_funnel**: Calculator step progression
- **form_interaction**: Form field interactions

## Automatic Tracking

### Enhanced Measurement (GA4)
Automatically tracks:
- Page views
- Scroll events (25%, 50%, 75%, 90%, 100%)
- Outbound link clicks
- Site search
- Video engagement
- File downloads
- Time on page (30-second milestone)

### Custom Scroll Tracking
- Tracks scroll depth at 25%, 50%, 75%, 90%, and 100%
- Prevents duplicate events per session

## Environment Configuration

### Production Environment
Create `.env` file with:
```
PUBLIC_GA_MEASUREMENT_ID=G-YOURMEASUREMENTID
PUBLIC_GTM_ID=GTM-YOURCONTAINERID
```

### Development Environment
- Events are logged to browser console instead of being sent to analytics
- Console logging includes event names and data for debugging

## Installation & Setup

1. **Set Environment Variables**:
   ```bash
   # Add to .env file
   PUBLIC_GA_MEASUREMENT_ID=G-YOURMEASUREMENTID
   PUBLIC_GTM_ID=GTM-YOURCONTAINERID
   ```

2. **Analytics are automatically included** in all pages through `Layout.astro`

3. **Test in Development**:
   ```bash
   npm run dev
   ```
   Open browser console to see analytics events being logged

## GTM Configuration

When setting up Google Tag Manager, configure triggers for:

### HighLevel Integration
- **highlevel_lead_captured**: Custom event for CRM integration
- **lead_captured**: Enhanced ecommerce event
- **calculator_funnel**: Calculator progression tracking

### Data Layer Variables
- `lead_source`: Source of the lead (e.g., "1031 Tax Calculator")
- `lead_value`: Estimated lead value (tax savings amount)
- `lead_type`: Type of lead (e.g., "calculator", "general")
- `form_name`: Name of the form submitted
- `calculator_savings`: Tax savings amount from calculator

## Testing Analytics

### Development Testing
1. Run `npm run dev`
2. Open browser console
3. Interact with site elements (buttons, calculator, forms)
4. Verify events appear in console logs

### Production Testing
1. Deploy with analytics IDs configured
2. Use Google Analytics Real-Time reports
3. Use GTM Preview mode
4. Test all tracked interactions

## Troubleshooting

### Common Issues
1. **Events not firing**: Check browser console for JavaScript errors
2. **Production events not showing**: Verify environment variables are set
3. **GTM not loading**: Check GTM container ID format
4. **GA4 not tracking**: Verify measurement ID format

### Debug Mode
Set `?gtm_debug=1` in URL to enable GTM debug mode for troubleshooting tag firing.

## Analytics Goals & KPIs

### Primary Conversion Events
1. **Calculator Completion**: Users who complete tax savings calculation
2. **Lead Capture**: Users who provide contact information
3. **Phone Calls**: Users who click phone numbers
4. **Contact Form**: Users who visit contact page

### Engagement Metrics
1. **Scroll Depth**: Content engagement measurement
2. **Time on Page**: User engagement duration
3. **Service Page Views**: Interest in specific exchange types
4. **Calculator Funnel**: Progression through calculator steps

### Business Intelligence
- **Average Tax Savings**: Track potential client value
- **Lead Source Attribution**: Identify highest-converting pages
- **Service Interest**: Most popular exchange types
- **Geographic Data**: State-level interest patterns

## Future Enhancements

1. **Enhanced Ecommerce**: Complete funnel tracking
2. **Custom Dimensions**: User segments and properties
3. **Cross-Domain Tracking**: Subdomain analytics
4. **Server-Side Tracking**: Enhanced data accuracy
5. **Attribution Modeling**: Multi-touch attribution