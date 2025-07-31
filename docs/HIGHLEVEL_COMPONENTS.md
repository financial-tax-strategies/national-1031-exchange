# HighLevel Booking Component Documentation

Complete guide for using the appointment booking React component.

## Table of Contents

1. [Component Overview](#component-overview)
2. [Props Reference](#props-reference)
3. [Usage Examples](#usage-examples)
4. [Customization](#customization)
5. [Event Handling](#event-handling)
6. [Styling Guide](#styling-guide)
7. [Accessibility](#accessibility)
8. [Best Practices](#best-practices)

## Component Overview

The `AppointmentBooking` component provides a complete booking flow for scheduling appointments through HighLevel CRM.

### Features

- 📅 Interactive date selection
- ⏰ Available time slot display
- ✅ Booking confirmation UI
- 🔄 Real-time status updates
- 📱 Mobile-responsive design
- ♿ Accessibility compliant
- 🎨 Customizable styling

### Component States

```typescript
type BookingState = 
  | 'idle'                    // Initial state
  | 'loading-availability'    // Fetching available slots
  | 'selecting-date'          // User selecting date
  | 'selecting-time'          // User selecting time slot
  | 'confirming-details'      // Showing booking summary
  | 'creating-appointment'    // Creating appointment
  | 'pending-assignment'      // Waiting for specialist
  | 'confirmed'              // Appointment confirmed
  | 'error';                 // Error state
```

## Props Reference

### Required Props

#### `leadData`

Contact information from the lead.

```typescript
interface LeadData {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  taxSavingsAmount?: number;
  propertySalePrice?: number;
  propertyDetails?: Record<string, any>;
}
```

**Example:**
```jsx
<AppointmentBooking
  leadData={{
    email: 'john@example.com',
    phone: '555-0123',
    firstName: 'John',
    lastName: 'Doe',
    taxSavingsAmount: 150000,
    propertySalePrice: 1000000
  }}
  // ... other props
/>
```

#### `onSuccess`

Callback when appointment is successfully booked.

```typescript
onSuccess: (appointment: Appointment) => void
```

**Example:**
```jsx
onSuccess={(appointment) => {
  console.log('Booked!', appointment);
  // Show success message
  // Redirect to confirmation page
  // Track conversion
}}
```

#### `onError`

Callback when an error occurs.

```typescript
onError: (error: BookingError) => void
```

**Example:**
```jsx
onError={(error) => {
  console.error('Booking error:', error);
  // Show error notification
  // Log to error tracking
  // Offer alternative contact method
}}
```

### Optional Props

#### `onCancel`

Callback when user cancels booking flow.

```typescript
onCancel?: () => void
```

**Example:**
```jsx
onCancel={() => {
  setShowBooking(false);
  // Track abandonment
}}
```

#### `options`

Configuration options for the booking flow.

```typescript
interface BookingOptions {
  timezone?: string;        // Default: 'America/New_York'
  prefetchDays?: number;    // Default: 14
  minBookingHours?: number; // Default: 2
  maxBookingDays?: number;  // Default: 60
  debugMode?: boolean;      // Default: false
}
```

**Example:**
```jsx
options={{
  timezone: 'America/Los_Angeles',
  prefetchDays: 21,
  minBookingHours: 4,
  maxBookingDays: 30,
  debugMode: process.env.NODE_ENV === 'development'
}}
```

## Usage Examples

### Basic Implementation

```jsx
import AppointmentBooking from './components/booking/AppointmentBooking';

function BookingPage() {
  const handleSuccess = (appointment) => {
    console.log('Appointment booked:', appointment);
    // Navigate to success page
  };

  const handleError = (error) => {
    console.error('Booking failed:', error);
    // Show error message
  };

  return (
    <AppointmentBooking
      leadData={{
        email: 'customer@example.com',
        firstName: 'Jane',
        lastName: 'Smith'
      }}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

### With Calculator Integration

```jsx
function TaxCalculator() {
  const [showBooking, setShowBooking] = useState(false);
  const [leadData, setLeadData] = useState(null);

  const handleCalculationComplete = (result) => {
    setLeadData({
      email: result.email,
      firstName: result.name.split(' ')[0],
      lastName: result.name.split(' ').slice(1).join(' '),
      taxSavingsAmount: result.savings,
      propertySalePrice: result.salePrice
    });
    setShowBooking(true);
  };

  if (showBooking && leadData) {
    return (
      <AppointmentBooking
        leadData={leadData}
        onSuccess={(appointment) => {
          // Track conversion
          analytics.track('appointment_booked', {
            value: leadData.taxSavingsAmount
          });
          // Show confirmation
        }}
        onError={(error) => {
          console.error(error);
          // Offer phone contact
        }}
        onCancel={() => setShowBooking(false)}
      />
    );
  }

  return <CalculatorForm onComplete={handleCalculationComplete} />;
}
```

### With Custom Options

```jsx
<AppointmentBooking
  leadData={leadData}
  onSuccess={handleSuccess}
  onError={handleError}
  options={{
    timezone: userTimezone || 'America/New_York',
    prefetchDays: 30,        // Show 30 days of availability
    minBookingHours: 24,     // Require 24 hours notice
    maxBookingDays: 90,      // Allow booking up to 90 days out
    debugMode: isDevelopment // Enable console logging
  }}
/>
```

### With State Management

```jsx
function BookingContainer() {
  const [bookingState, setBookingState] = useState({
    appointment: null,
    error: null,
    isComplete: false
  });

  return (
    <div>
      {!bookingState.isComplete ? (
        <AppointmentBooking
          leadData={getLeadData()}
          onSuccess={(appointment) => {
            setBookingState({
              appointment,
              error: null,
              isComplete: true
            });
          }}
          onError={(error) => {
            setBookingState(prev => ({
              ...prev,
              error
            }));
          }}
        />
      ) : (
        <ConfirmationPage appointment={bookingState.appointment} />
      )}
    </div>
  );
}
```

## Customization

### Styling with CSS

The component uses Tailwind CSS classes. Override with custom CSS:

```css
/* Custom date selection */
.appointment-booking .date-button {
  @apply bg-brand-primary hover:bg-brand-secondary;
}

/* Custom time slots */
.appointment-booking .time-slot {
  @apply rounded-full px-6 py-3;
}

/* Loading states */
.appointment-booking .loading-spinner {
  @apply border-brand-primary;
}
```

### Theme Customization

Pass custom className or wrap in styled component:

```jsx
// With className
<div className="custom-booking-theme">
  <AppointmentBooking {...props} />
</div>

// With styled-components
const ThemedBooking = styled.div`
  .appointment-booking {
    --primary-color: ${props => props.theme.primary};
    --secondary-color: ${props => props.theme.secondary};
  }
`;
```

### Custom Loading Component

```jsx
const CustomBooking = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <CustomLoadingSpinner />;
  }

  return <AppointmentBooking {...props} />;
};
```

## Event Handling

### Tracking User Journey

```jsx
function TrackedBooking({ leadData }) {
  useEffect(() => {
    // Track component mount
    analytics.track('booking_flow_started');
  }, []);

  const handleDateSelect = (date) => {
    analytics.track('booking_date_selected', { date });
  };

  const handleTimeSelect = (time) => {
    analytics.track('booking_time_selected', { time });
  };

  return (
    <AppointmentBooking
      leadData={leadData}
      onSuccess={(appointment) => {
        analytics.track('booking_completed', {
          appointmentId: appointment.id,
          value: leadData.taxSavingsAmount
        });
      }}
      onError={(error) => {
        analytics.track('booking_error', {
          errorCode: error.code,
          errorMessage: error.message
        });
      }}
      onCancel={() => {
        analytics.track('booking_cancelled');
      }}
    />
  );
}
```

### Error Recovery

```jsx
function BookingWithRetry({ leadData }) {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const handleError = (error) => {
    if (error.retryable && retryCount < maxRetries) {
      // Show retry option
      return (
        <div>
          <p>{error.userMessage}</p>
          <button onClick={() => setRetryCount(prev => prev + 1)}>
            Try Again ({maxRetries - retryCount} attempts remaining)
          </button>
        </div>
      );
    }
    
    // Show alternative contact method
    return (
      <div>
        <p>Unable to book online.</p>
        <a href="tel:+1234567890">Call us instead</a>
      </div>
    );
  };

  return (
    <AppointmentBooking
      key={retryCount} // Force remount on retry
      leadData={leadData}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

## Styling Guide

### Component Structure

```html
<div class="appointment-booking">
  <!-- Date Selection -->
  <div class="date-selection">
    <h3>Select a Date</h3>
    <div class="date-grid">
      <button class="date-button">...</button>
    </div>
  </div>

  <!-- Time Selection -->
  <div class="time-selection">
    <h3>Select a Time</h3>
    <div class="time-grid">
      <button class="time-slot">...</button>
    </div>
  </div>

  <!-- Confirmation -->
  <div class="booking-confirmation">
    <h3>Confirm Your Appointment</h3>
    <div class="appointment-details">...</div>
    <button class="confirm-button">Confirm</button>
  </div>

  <!-- Status Updates -->
  <div class="booking-status">
    <div class="status-icon">...</div>
    <h3 class="status-message">...</h3>
  </div>
</div>
```

### CSS Variables

```css
.appointment-booking {
  /* Colors */
  --booking-primary: #1e40af;
  --booking-secondary: #3b82f6;
  --booking-success: #10b981;
  --booking-error: #ef4444;
  
  /* Spacing */
  --booking-spacing: 1.5rem;
  --booking-radius: 0.5rem;
  
  /* Animation */
  --booking-transition: 200ms ease;
}
```

### Responsive Design

The component is mobile-first with breakpoints:

```css
/* Mobile: Full width buttons */
@media (max-width: 640px) {
  .date-grid { grid-template-columns: 1fr; }
  .time-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Tablet: 2 columns for dates */
@media (min-width: 641px) {
  .date-grid { grid-template-columns: repeat(2, 1fr); }
  .time-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Desktop: 3 columns for dates */
@media (min-width: 1024px) {
  .date-grid { grid-template-columns: repeat(3, 1fr); }
  .time-grid { grid-template-columns: repeat(4, 1fr); }
}
```

## Accessibility

### Keyboard Navigation

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Select dates and times
- **Escape**: Cancel current operation
- **Arrow Keys**: Navigate date grid (when implemented)

### Screen Reader Support

```jsx
// Proper ARIA labels
<button
  aria-label={`Select ${date.toLocaleDateString()}`}
  aria-pressed={isSelected}
>
  {date.getDate()}
</button>

// Status announcements
<div role="status" aria-live="polite">
  {currentStep === 'confirmed' && 'Appointment confirmed'}
</div>

// Error announcements
<div role="alert" aria-live="assertive">
  {error && error.userMessage}
</div>
```

### Focus Management

```jsx
useEffect(() => {
  // Focus first available date on load
  if (currentStep === 'selecting-date') {
    document.querySelector('.date-button')?.focus();
  }
}, [currentStep]);
```

## Best Practices

### 1. Error Handling

Always provide user-friendly error messages:

```jsx
onError={(error) => {
  // Log technical details
  console.error('Booking error:', error);
  
  // Show user-friendly message
  showNotification({
    type: 'error',
    message: error.userMessage,
    action: error.retryable ? 'Retry' : 'Contact Support'
  });
}}
```

### 2. Loading States

Show appropriate feedback during async operations:

```jsx
const [parentLoading, setParentLoading] = useState(false);

// Wrap component with loading state
{parentLoading ? (
  <LoadingSpinner message="Preparing booking system..." />
) : (
  <AppointmentBooking {...props} />
)}
```

### 3. Data Validation

Validate lead data before passing:

```jsx
const validateLeadData = (data) => {
  const errors = [];
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email required');
  }
  
  if (!data.firstName || !data.lastName) {
    errors.push('Full name required');
  }
  
  return errors;
};

// Use validation
const errors = validateLeadData(formData);
if (errors.length === 0) {
  setLeadData(formData);
  setShowBooking(true);
}
```

### 4. Performance Optimization

Lazy load the component:

```jsx
const AppointmentBooking = lazy(() => 
  import('./components/booking/AppointmentBooking')
);

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <AppointmentBooking {...props} />
</Suspense>
```

### 5. Analytics Integration

Track the complete funnel:

```jsx
const BookingWithAnalytics = (props) => {
  // Page view
  useEffect(() => {
    analytics.page('Appointment Booking');
  }, []);

  return (
    <AppointmentBooking
      {...props}
      onSuccess={(appointment) => {
        // Track conversion
        analytics.track('Appointment Booked', {
          appointmentId: appointment.id,
          specialistId: appointment.assignedSpecialistId,
          leadValue: props.leadData.taxSavingsAmount,
          source: 'tax_calculator'
        });
        
        // Call parent handler
        props.onSuccess(appointment);
      }}
    />
  );
};
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import { 
  AppointmentBooking,
  type BookingFlowProps,
  type Appointment,
  type BookingError,
  type BookingOptions 
} from './components/booking';

const MyComponent: React.FC = () => {
  const handleSuccess = (appointment: Appointment): void => {
    console.log(appointment.assignedSpecialistName);
  };

  const handleError = (error: BookingError): void => {
    if (error.retryable) {
      // Show retry option
    }
  };

  return <AppointmentBooking {...props} />;
};
```

---

*For additional examples, see the implementation in `src/components/calculators/TaxSavingsCalculator.tsx`*