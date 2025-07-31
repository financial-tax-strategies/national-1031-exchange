# HighLevel API Reference

Complete API documentation for the HighLevel CRM integration services.

## Table of Contents

1. [HighLevelService](#highlevelservice)
2. [DatabaseService](#databaseservice)
3. [AppointmentPoller](#appointmentpoller)
4. [Type Definitions](#type-definitions)
5. [Error Handling](#error-handling)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)

## HighLevelService

Main service class for HighLevel CRM API communication.

### Constructor

```typescript
new HighLevelService(config: HighLevelConfig)
```

**Parameters:**
- `config`: HighLevel configuration object containing API credentials

### Methods

#### createContact

Creates or updates a contact in HighLevel CRM.

```typescript
async createContact(contactData: {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  taxSavingsAmount?: number;
  propertySalePrice?: number;
  source?: string;
}): Promise<string>
```

**Returns:** Contact ID

**Throws:** `BookingError` with code `CONTACT_CREATION_FAILED`

**Example:**
```typescript
const contactId = await highlevelService.createContact({
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  taxSavingsAmount: 150000,
  source: '1031 Tax Calculator'
});
```

#### getContactByEmail

Searches for existing contact by email address.

```typescript
async getContactByEmail(email: string): Promise<string | null>
```

**Returns:** Contact ID or null if not found

**Example:**
```typescript
const existingId = await highlevelService.getContactByEmail('john@example.com');
if (existingId) {
  console.log('Contact exists:', existingId);
}
```

#### getAvailability

Fetches available appointment slots for a calendar.

```typescript
async getAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse>
```

**Parameters:**
```typescript
interface AvailabilityRequest {
  calendarId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  timezone: string;
}
```

**Returns:**
```typescript
interface AvailabilityResponse {
  calendarId: string;
  timezone: string;
  slots: AvailableSlot[];
  cached: boolean;
}
```

**Example:**
```typescript
const availability = await highlevelService.getAvailability({
  calendarId: 'cal_123',
  startDate: '2025-02-01',
  endDate: '2025-02-14',
  timezone: 'America/New_York'
});
```

#### createAppointment

Creates an appointment in HighLevel.

```typescript
async createAppointment(appointmentData: CreateAppointmentRequest): Promise<Appointment>
```

**Parameters:**
```typescript
interface CreateAppointmentRequest {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  appointmentDate: string; // ISO string
  timezone: string;
  taxSavingsAmount?: number;
  propertySalePrice?: number;
  propertyType?: string;
  exchangeTimeline?: string;
  sourceUrl?: string;
  formData?: Record<string, any>;
}
```

**Returns:** Created appointment object

**Example:**
```typescript
const appointment = await highlevelService.createAppointment({
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  appointmentDate: '2025-02-01T14:00:00Z',
  timezone: 'America/New_York',
  taxSavingsAmount: 150000
});
```

#### getAppointmentStatus

Fetches current appointment status (used for polling).

```typescript
async getAppointmentStatus(appointmentId: string): Promise<HighLevelAppointmentResponse | null>
```

**Returns:** Appointment details or null if not found

## DatabaseService

Manages all Supabase database operations.

### Methods

#### getHighLevelConfig

Retrieves active HighLevel configuration.

```typescript
async getHighLevelConfig(): Promise<HighLevelConfig | null>
```

#### createAppointment

Saves appointment to database.

```typescript
async createAppointment(
  appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Appointment>
```

#### updateAppointment

Updates appointment status and details.

```typescript
async updateAppointment(
  appointmentId: string, 
  updates: Partial<Appointment>
): Promise<Appointment | null>
```

#### getAppointment

Retrieves appointment by ID.

```typescript
async getAppointment(appointmentId: string): Promise<Appointment | null>
```

#### subscribeToAppointment

Creates real-time subscription for appointment updates.

```typescript
subscribeToAppointment(
  appointmentId: string, 
  callback: (appointment: Appointment) => void
): RealtimeChannel
```

**Example:**
```typescript
const subscription = databaseService.subscribeToAppointment(
  appointmentId,
  (updated) => {
    console.log('Appointment updated:', updated.status);
  }
);

// Cleanup
subscription.unsubscribe();
```

#### getCachedAvailability

Retrieves cached availability data.

```typescript
async getCachedAvailability(cacheKey: string): Promise<AvailableSlot[] | null>
```

#### cacheAvailability

Stores availability data with TTL.

```typescript
async cacheAvailability(
  cacheKey: string,
  calendarId: string,
  date: Date,
  timezone: string,
  slots: AvailableSlot[],
  ttlMinutes: number = 1
): Promise<void>
```

## AppointmentPoller

Intelligent polling system for appointment status updates.

### Constructor

```typescript
new AppointmentPoller(config?: Partial<PollingConfig>)
```

**Default Configuration:**
```typescript
{
  maxAttempts: 10,
  baseInterval: 5000,   // 5 seconds
  maxInterval: 60000,   // 1 minute
  exponentialBackoff: true
}
```

### Methods

#### startPolling

Begins polling for appointment updates.

```typescript
async startPolling(
  appointmentId: string,
  onUpdate: (appointment: Appointment) => void,
  onError: (error: Error) => void
): Promise<void>
```

**Example:**
```typescript
const poller = getAppointmentPoller();

await poller.startPolling(
  appointmentId,
  (appointment) => {
    if (appointment.status === 'confirmed') {
      console.log('Assigned to:', appointment.assignedSpecialistName);
    }
  },
  (error) => {
    console.error('Polling failed:', error);
  }
);
```

#### stopPolling

Stops polling for specific appointment.

```typescript
stopPolling(appointmentId: string): void
```

#### stopAllPolling

Stops all active polling operations.

```typescript
stopAllPolling(): void
```

## Type Definitions

### Core Types

```typescript
// Appointment Status Lifecycle
type AppointmentStatus = 
  | 'pending_assignment'  // Waiting for specialist
  | 'confirmed'          // Specialist assigned
  | 'failed'            // Assignment failed
  | 'cancelled'         // User cancelled
  | 'completed'         // Appointment occurred
  | 'no_show';          // Customer didn't attend

// Main Appointment Interface
interface Appointment {
  id: string;
  highlevelAppointmentId: string;
  highlevelContactId: string;
  status: AppointmentStatus;
  assignedSpecialistId?: string;
  assignedSpecialistName?: string;
  meetingLocation?: string;
  appointmentDate: Date;
  appointmentTime: string;
  timezone: string;
  durationMinutes: number;
  contactEmail: string;
  contactPhone?: string;
  contactFirstName: string;
  contactLastName: string;
  taxSavingsAmount?: number;
  propertySalePrice?: number;
  // ... additional fields
}

// Available Time Slot
interface AvailableSlot {
  time: string;        // ISO timestamp
  available: boolean;
  duration: number;    // minutes
  displayTime?: string;
}
```

### Error Types

```typescript
enum BookingErrorCode {
  // API Errors
  API_TIMEOUT = 'API_TIMEOUT',
  API_RATE_LIMIT = 'API_RATE_LIMIT',
  API_INVALID_RESPONSE = 'API_INVALID_RESPONSE',
  
  // Availability Errors
  NO_AVAILABILITY = 'NO_AVAILABILITY',
  SLOT_NO_LONGER_AVAILABLE = 'SLOT_NO_LONGER_AVAILABLE',
  
  // Contact Errors
  CONTACT_CREATION_FAILED = 'CONTACT_CREATION_FAILED',
  
  // Appointment Errors
  APPOINTMENT_CREATION_FAILED = 'APPOINTMENT_CREATION_FAILED',
  ASSIGNMENT_TIMEOUT = 'ASSIGNMENT_TIMEOUT',
  
  // Configuration Errors
  INVALID_CONFIG = 'INVALID_CONFIG',
  
  // Network Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}

interface BookingError {
  code: BookingErrorCode;
  message: string;
  details?: any;
  userMessage: string;
  retryable: boolean;
}
```

## Error Handling

### Error Response Pattern

All services follow consistent error handling:

```typescript
try {
  const result = await service.someMethod();
} catch (error) {
  if (error.code === BookingErrorCode.API_RATE_LIMIT) {
    // Handle rate limiting
    await delay(60000); // Wait 1 minute
    // Retry
  } else if (error.retryable) {
    // Implement retry logic
  } else {
    // Show user error.userMessage
  }
}
```

### Common Error Scenarios

1. **API Timeout**
   - Automatically retried with exponential backoff
   - Max 3 retries before failing

2. **Rate Limiting**
   - Returns `API_RATE_LIMIT` error
   - Includes retry-after header when available

3. **Network Errors**
   - Wrapped as `NETWORK_ERROR`
   - Always marked as retryable

4. **Invalid Data**
   - Returns specific error codes
   - Includes validation details

## Usage Examples

### Complete Booking Flow

```typescript
// 1. Initialize services
const highlevelService = await getHighLevelService();
const databaseService = getDatabaseService();
const poller = getAppointmentPoller();

// 2. Get availability
const availability = await highlevelService.getAvailability({
  calendarId: config.calendarId,
  startDate: '2025-02-01',
  endDate: '2025-02-14',
  timezone: 'America/New_York'
});

// 3. Create appointment
const appointment = await highlevelService.createAppointment({
  email: leadData.email,
  firstName: leadData.firstName,
  lastName: leadData.lastName,
  appointmentDate: selectedSlot.time,
  timezone: 'America/New_York',
  taxSavingsAmount: 150000
});

// 4. Save to database
const saved = await databaseService.createAppointment(appointment);

// 5. Set up real-time updates
const subscription = databaseService.subscribeToAppointment(
  saved.id,
  (updated) => {
    if (updated.status === 'confirmed') {
      console.log('Appointment confirmed!');
    }
  }
);

// 6. Start polling fallback
poller.startPolling(
  saved.id,
  (updated) => console.log('Polling update:', updated),
  (error) => console.error('Polling error:', error)
);
```

### Caching Strategy

```typescript
// Generate cache key
const cacheKey = `availability_${calendarId}_${date}_${timezone}`;

// Check cache first
let slots = await databaseService.getCachedAvailability(cacheKey);

if (!slots) {
  // Fetch from API
  const response = await highlevelService.getAvailability(request);
  slots = response.slots;
  
  // Cache for 1 minute
  await databaseService.cacheAvailability(
    cacheKey,
    calendarId,
    new Date(date),
    timezone,
    slots,
    1 // TTL in minutes
  );
}
```

## Best Practices

### 1. Service Initialization

Always use singleton pattern:

```typescript
// ✅ Good - reuses instance
const service = await getHighLevelService();

// ❌ Bad - creates multiple instances
const service = new HighLevelService(config);
```

### 2. Error Handling

Always provide user-friendly messages:

```typescript
try {
  await createAppointment(data);
} catch (error) {
  // Show error.userMessage to user
  showNotification(error.userMessage);
  
  // Log full error for debugging
  console.error('Appointment error:', error);
}
```

### 3. Cleanup Subscriptions

Always unsubscribe when done:

```typescript
useEffect(() => {
  const subscription = databaseService.subscribeToAppointment(id, callback);
  
  return () => {
    subscription.unsubscribe();
  };
}, [id]);
```

### 4. Rate Limiting

Implement proper backoff:

```typescript
const backoffMultiplier = 1.5;
let delay = 1000;

for (let i = 0; i < maxRetries; i++) {
  try {
    return await apiCall();
  } catch (error) {
    if (error.code === 'API_RATE_LIMIT') {
      await sleep(delay);
      delay *= backoffMultiplier;
    } else {
      throw error;
    }
  }
}
```

### 5. Polling Management

Use singleton poller to prevent duplicates:

```typescript
// ✅ Good - managed polling
const poller = getAppointmentPoller();
poller.startPolling(id, onUpdate, onError);

// ❌ Bad - unmanaged polling
setInterval(() => checkStatus(id), 5000);
```

## API Rate Limits

HighLevel API limits (as of 2025):

- **Requests per minute**: 60
- **Requests per hour**: 1000
- **Concurrent requests**: 10

Built-in protections:
- Automatic retry with backoff
- Request queuing
- Rate limit headers parsing
- Graceful degradation

## Testing

### Mock Services

For testing, use mock implementations:

```typescript
class MockHighLevelService {
  async createAppointment(data) {
    return {
      id: 'test_' + Date.now(),
      status: 'pending_assignment',
      ...data
    };
  }
}
```

### Test Webhooks

Use Netlify CLI for local webhook testing:

```bash
netlify dev
# Exposes local endpoint for webhook testing
```

---

*For additional examples and patterns, see the implementation files in `src/lib/services/`*