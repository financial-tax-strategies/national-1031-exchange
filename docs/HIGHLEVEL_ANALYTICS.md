# HighLevel Booking Analytics Guide

Comprehensive guide for tracking, analyzing, and optimizing the appointment booking funnel.

## Table of Contents

1. [Analytics Overview](#analytics-overview)
2. [Event Tracking Reference](#event-tracking-reference)
3. [Funnel Analysis](#funnel-analysis)
4. [Performance Metrics](#performance-metrics)
5. [Conversion Optimization](#conversion-optimization)
6. [Dashboard Setup](#dashboard-setup)
7. [Key Metrics & KPIs](#key-metrics--kpis)
8. [Reports & Insights](#reports--insights)

## Analytics Overview

The booking analytics system provides comprehensive tracking across the entire appointment booking journey.

### Integration Points

- **Google Analytics 4**: Core event tracking
- **Google Tag Manager**: Enhanced data collection
- **HighLevel CRM**: Lead value tracking
- **Custom Analytics**: Performance monitoring

### Data Flow

```
User Action → Event Fired → GA4/GTM → Data Layer → Reports
     ↓
Analytics DB → Dashboards → Insights → Optimization
```

## Event Tracking Reference

### Booking Flow Events

#### `booking_flow_started`
Fired when user initiates booking from calculator.

```javascript
{
  event: 'booking_flow_started',
  event_category: 'booking_flow',
  event_label: 'tax_calculator',
  value: 150000, // Tax savings amount
  custom_data: {
    property_sale_price: 1000000,
    tax_savings_amount: 150000,
    source: '1031_tax_calculator'
  }
}
```

#### `booking_date_selected`
User selects an appointment date.

```javascript
{
  event: 'booking_date_selected',
  event_category: 'booking_flow',
  event_label: '2025-02-15',
  custom_data: {
    selected_date: '2025-02-15',
    available_dates_count: 14,
    day_of_week: 'Thursday',
    days_from_now: 14
  }
}
```

#### `booking_time_selected`
User selects a time slot.

```javascript
{
  event: 'booking_time_selected',
  event_category: 'booking_flow',
  event_label: '2:00 PM',
  custom_data: {
    selected_time: '2025-02-15T14:00:00',
    display_time: '2:00 PM',
    available_slots_count: 8,
    hour_of_day: 14,
    duration_minutes: 30,
    hour_preference: 'afternoon' // morning|afternoon|evening
  }
}
```

#### `booking_confirmed`
User confirms appointment details.

```javascript
{
  event: 'booking_confirmed',
  event_category: 'booking_flow',
  event_label: 'appointment_details_confirmed',
  value: 150000,
  custom_data: {
    contact_email: 'user@example.com',
    tax_savings: 150000,
    property_price: 1000000,
    timezone: 'America/New_York',
    duration: 30,
    booking_id: 'hl_apt_123'
  }
}
```

### Appointment Events

#### `appointment_created`
Appointment successfully created in HighLevel.

```javascript
{
  event: 'appointment_created',
  event_category: 'appointment',
  event_label: 'highlevel_appointment_created',
  value: 150000,
  custom_data: {
    appointment_id: 'hl_apt_123',
    contact_id: 'hl_con_456',
    status: 'pending_assignment'
  }
}
```

#### `appointment_assigned`
Specialist assigned to appointment.

```javascript
{
  event: 'appointment_assigned',
  event_category: 'appointment',
  event_label: 'specialist_assigned',
  value: 150000,
  custom_data: {
    specialist_id: 'usr_789',
    specialist_name: 'John Doe',
    meeting_location: 'https://zoom.us/j/123',
    assignment_method: 'webhook' // webhook|polling
  }
}
```

#### `booking_completed`
Full booking flow completed successfully.

```javascript
{
  event: 'booking_completed',
  event_category: 'appointment',
  event_label: 'booking_flow_completed',
  value: 150000,
  conversion: true,
  transaction_id: 'booking_1234567890'
}
```

### Error & Performance Events

#### `booking_error`
Error occurred during booking.

```javascript
{
  event: 'booking_error',
  event_category: 'booking_error',
  event_label: 'API_TIMEOUT',
  custom_data: {
    error_code: 'API_TIMEOUT',
    error_message: 'Request timed out',
    retryable: true,
    step: 'creating-appointment',
    context: { source: 'webhook_subscription' }
  }
}
```

#### `booking_abandoned`
User abandoned booking flow.

```javascript
{
  event: 'booking_abandoned',
  event_category: 'booking_flow',
  event_label: 'user_cancelled',
  custom_data: {
    abandoned_step: 'selecting-time',
    abandonment_reason: 'user_clicked_cancel'
  }
}
```

#### `availability_loaded`
Availability data loaded performance.

```javascript
{
  event: 'availability_loaded',
  event_category: 'booking_flow',
  event_label: 'fresh', // cached|fresh
  value: 1250, // Duration in ms
  custom_data: {
    loading_duration_ms: 1250,
    slots_count: 42,
    cached: false,
    performance_category: 'acceptable' // fast|acceptable|slow|very_slow
  }
}
```

## Funnel Analysis

### Booking Funnel Stages

```
1. Calculator Completion
   ↓ (booking_flow_started)
2. Date Selection
   ↓ (booking_date_selected)
3. Time Selection
   ↓ (booking_time_selected)
4. Confirmation
   ↓ (booking_confirmed)
5. Appointment Creation
   ↓ (appointment_created)
6. Specialist Assignment
   ↓ (appointment_assigned)
7. Booking Complete
   ✓ (booking_completed)
```

### GA4 Funnel Setup

1. **Navigate to**: Configure → Events → Create event
2. **Create funnel steps**:

```javascript
// Step 1: Flow Started
Event name: booking_flow_started
Parameter: event_label equals 'tax_calculator'

// Step 2: Date Selected
Event name: booking_date_selected
Parameter: event_category equals 'booking_flow'

// Step 3: Time Selected
Event name: booking_time_selected
Parameter: event_category equals 'booking_flow'

// Step 4: Confirmed
Event name: booking_confirmed
Parameter: event_category equals 'booking_flow'

// Step 5: Created
Event name: appointment_created
Parameter: event_category equals 'appointment'

// Step 6: Assigned
Event name: appointment_assigned
Parameter: event_category equals 'appointment'

// Step 7: Completed
Event name: booking_completed
Parameter: event_category equals 'appointment'
```

### Funnel Metrics

```sql
-- Funnel conversion rates
WITH funnel AS (
  SELECT 
    COUNT(DISTINCT CASE WHEN event_name = 'booking_flow_started' THEN user_id END) as started,
    COUNT(DISTINCT CASE WHEN event_name = 'booking_date_selected' THEN user_id END) as date_selected,
    COUNT(DISTINCT CASE WHEN event_name = 'booking_time_selected' THEN user_id END) as time_selected,
    COUNT(DISTINCT CASE WHEN event_name = 'booking_confirmed' THEN user_id END) as confirmed,
    COUNT(DISTINCT CASE WHEN event_name = 'appointment_created' THEN user_id END) as created,
    COUNT(DISTINCT CASE WHEN event_name = 'appointment_assigned' THEN user_id END) as assigned,
    COUNT(DISTINCT CASE WHEN event_name = 'booking_completed' THEN user_id END) as completed
  FROM analytics_events
  WHERE event_date >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT 
  started,
  ROUND(date_selected::numeric / started * 100, 2) as date_selection_rate,
  ROUND(time_selected::numeric / date_selected * 100, 2) as time_selection_rate,
  ROUND(confirmed::numeric / time_selected * 100, 2) as confirmation_rate,
  ROUND(created::numeric / confirmed * 100, 2) as creation_rate,
  ROUND(assigned::numeric / created * 100, 2) as assignment_rate,
  ROUND(completed::numeric / started * 100, 2) as overall_conversion_rate
FROM funnel;
```

## Performance Metrics

### Loading Performance

Track page and component loading times:

```javascript
// Availability Loading
Average: 1.2s
P50: 0.9s
P90: 2.1s
P99: 3.5s

// Appointment Creation
Average: 1.8s
P50: 1.5s
P90: 2.8s
P99: 4.2s
```

### Performance Categories

```javascript
const categorizePerformance = (duration) => {
  if (duration < 1000) return 'fast';        // <1s
  if (duration < 3000) return 'acceptable';  // 1-3s
  if (duration < 5000) return 'slow';        // 3-5s
  return 'very_slow';                        // >5s
};
```

### Performance Dashboard

```sql
-- Performance metrics by day
SELECT 
  DATE(timestamp) as date,
  event_label,
  COUNT(*) as total_loads,
  AVG(value) as avg_duration_ms,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value) as p50_ms,
  PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY value) as p90_ms,
  PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY value) as p99_ms
FROM analytics_events
WHERE event_name = 'availability_loaded'
GROUP BY DATE(timestamp), event_label
ORDER BY date DESC;
```

## Conversion Optimization

### A/B Testing Ideas

#### 1. Booking Button Text
```javascript
// Version A
"Schedule Free Consultation"

// Version B
"Book Your 30-Minute Call"

// Track with:
gtag('event', 'experiment_view', {
  experiment_id: 'booking_button_text',
  variant_id: 'A'
});
```

#### 2. Available Days Shown
```javascript
// Version A: 14 days
prefetchDays: 14

// Version B: 30 days
prefetchDays: 30

// Measure impact on date selection rate
```

#### 3. Time Slot Display
```javascript
// Version A: Grid layout
<div className="grid grid-cols-4">

// Version B: List layout
<div className="flex flex-col">

// Track time selection speed
```

### Optimization Metrics

```sql
-- Abandonment by step
SELECT 
  abandoned_step,
  COUNT(*) as abandonment_count,
  AVG(time_on_step) as avg_seconds_on_step
FROM (
  SELECT 
    user_id,
    CASE 
      WHEN last_event = 'booking_flow_started' THEN 'date_selection'
      WHEN last_event = 'booking_date_selected' THEN 'time_selection'
      WHEN last_event = 'booking_time_selected' THEN 'confirmation'
      WHEN last_event = 'booking_confirmed' THEN 'appointment_creation'
    END as abandoned_step,
    EXTRACT(EPOCH FROM (last_timestamp - first_timestamp)) as time_on_step
  FROM user_sessions
  WHERE completed = false
) abandonments
GROUP BY abandoned_step;
```

## Dashboard Setup

### Google Analytics 4 Dashboard

1. **Create Custom Dashboard**
   - Name: "HighLevel Booking Performance"
   - Add widgets for each funnel step

2. **Key Widgets**:
   - Funnel visualization
   - Conversion rate over time
   - Average booking value
   - Error rate by type
   - Performance metrics

3. **Custom Metrics**:
```javascript
// Average Tax Savings per Booking
Custom metric: tax_savings_amount
Aggregation: Average

// Booking Success Rate
Custom metric: booking_completed / booking_flow_started
Format: Percentage
```

### Google Data Studio Report

```sql
-- Connect GA4 to Data Studio
-- Create calculated fields:

-- Conversion Rate
SUM(CASE WHEN event_name = 'booking_completed' THEN 1 ELSE 0 END) / 
SUM(CASE WHEN event_name = 'booking_flow_started' THEN 1 ELSE 0 END)

-- Average Lead Value
AVG(CASE WHEN event_name = 'booking_completed' THEN event_value ELSE NULL END)

-- Assignment Success Rate
SUM(CASE WHEN custom_data.assignment_method = 'webhook' THEN 1 ELSE 0 END) /
COUNT(CASE WHEN event_name = 'appointment_assigned' THEN 1 END)
```

## Key Metrics & KPIs

### Primary KPIs

1. **Booking Conversion Rate**
   - Target: >20%
   - Formula: Completed / Started

2. **Average Time to Book**
   - Target: <3 minutes
   - Measure: First interaction to confirmation

3. **Assignment Success Rate**
   - Target: >95%
   - Formula: Assigned / Created

4. **Average Lead Value**
   - Track: Tax savings amount
   - Segment: By property value ranges

### Secondary Metrics

1. **Date Selection Patterns**
   - Most popular days
   - Booking advance time
   - Weekend vs weekday preference

2. **Time Slot Preferences**
   - Morning vs afternoon
   - Peak booking hours
   - Duration preferences

3. **Error Recovery Rate**
   - Retry success rate
   - Alternative contact method usage

4. **Performance Metrics**
   - Page load times
   - API response times
   - Real-time update latency

### Monitoring SQL

```sql
-- Daily KPI Dashboard
WITH daily_metrics AS (
  SELECT 
    DATE(timestamp) as date,
    COUNT(DISTINCT CASE WHEN event_name = 'booking_flow_started' THEN user_id END) as starts,
    COUNT(DISTINCT CASE WHEN event_name = 'booking_completed' THEN user_id END) as completions,
    AVG(CASE WHEN event_name = 'booking_completed' THEN event_value END) as avg_value,
    COUNT(CASE WHEN event_name = 'booking_error' THEN 1 END) as errors
  FROM analytics_events
  WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY DATE(timestamp)
)
SELECT 
  date,
  starts,
  completions,
  ROUND(completions::numeric / NULLIF(starts, 0) * 100, 2) as conversion_rate,
  ROUND(avg_value, 0) as avg_lead_value,
  errors,
  ROUND(errors::numeric / NULLIF(starts, 0) * 100, 2) as error_rate
FROM daily_metrics
ORDER BY date DESC;
```

## Reports & Insights

### Weekly Performance Report

```sql
-- Weekly summary email
SELECT 
  'Week of ' || DATE_TRUNC('week', CURRENT_DATE)::date as period,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(CASE WHEN event_name = 'booking_completed' THEN 1 END) as bookings,
  ROUND(AVG(CASE WHEN event_name = 'booking_completed' THEN event_value END), 0) as avg_value,
  ROUND(
    COUNT(CASE WHEN event_name = 'booking_completed' THEN 1 END)::numeric / 
    COUNT(DISTINCT CASE WHEN event_name = 'booking_flow_started' THEN user_id END) * 100, 
    2
  ) as conversion_rate,
  COUNT(CASE WHEN event_name = 'booking_error' THEN 1 END) as total_errors
FROM analytics_events
WHERE timestamp >= DATE_TRUNC('week', CURRENT_DATE)
AND timestamp < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week';
```

### Monthly Insights

1. **Conversion Funnel Analysis**
   - Step-by-step conversion rates
   - Biggest drop-off points
   - Month-over-month trends

2. **User Behavior Patterns**
   - Peak booking times
   - Device preferences
   - Geographic distribution

3. **Revenue Impact**
   - Total potential tax savings
   - Average deal size trends
   - ROI on marketing spend

### Actionable Insights Query

```sql
-- Find optimization opportunities
WITH funnel_analysis AS (
  SELECT 
    step_name,
    entries,
    exits,
    ROUND(exits::numeric / entries * 100, 2) as exit_rate
  FROM booking_funnel_steps
  WHERE period = 'last_30_days'
)
SELECT 
  step_name as "Optimize This Step",
  exit_rate as "Exit Rate %",
  CASE 
    WHEN exit_rate > 50 THEN 'Critical - Immediate attention needed'
    WHEN exit_rate > 30 THEN 'High - Schedule optimization sprint'
    WHEN exit_rate > 20 THEN 'Medium - Monitor and test improvements'
    ELSE 'Low - Performing well'
  END as "Priority",
  CASE step_name
    WHEN 'date_selection' THEN 'Show more available dates, highlight popular slots'
    WHEN 'time_selection' THEN 'Simplify time display, add timezone clarity'
    WHEN 'confirmation' THEN 'Reduce form fields, add trust signals'
    WHEN 'appointment_creation' THEN 'Improve loading states, add progress indicator'
  END as "Suggested Actions"
FROM funnel_analysis
WHERE exit_rate > 20
ORDER BY exit_rate DESC;
```

## Analytics Implementation Checklist

- [ ] GA4 events firing correctly
- [ ] GTM data layer populated
- [ ] Funnel tracking configured
- [ ] Custom dimensions created
- [ ] Conversion goals set
- [ ] Dashboard created
- [ ] Automated reports scheduled
- [ ] A/B testing framework ready
- [ ] Performance monitoring active
- [ ] Error tracking enabled

---

*For custom analytics implementations or advanced tracking needs, consult with the analytics team.*