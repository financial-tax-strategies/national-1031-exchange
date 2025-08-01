// ============================================
// 1031 Exchange Timeline Calculations
// ============================================

export interface ExchangeTimeline {
  saleDate: string;
  identificationDeadline: string;
  purchaseDeadline: string;
  daysElapsed: number;
  daysUntilIdentification: number;
  daysUntilPurchase: number;
  status: 'pending' | 'active' | 'identified' | 'expired';
}

export interface Property {
  id: string;
  address: string;
  identifiedDate: string;
  value?: number;
  status: 'potential' | 'identified' | 'purchased' | 'rejected';
  notes?: string;
}

export interface IdentificationRule {
  type: '3-property' | '200-percent' | '95-percent';
  description: string;
  requirements: string;
}

export const IDENTIFICATION_RULES: Record<string, IdentificationRule> = {
  '3-property': {
    type: '3-property',
    description: '3-Property Rule',
    requirements: 'Identify up to 3 properties of any value'
  },
  '200-percent': {
    type: '200-percent',
    description: '200% Rule',
    requirements: 'Identify unlimited properties if total value doesn\'t exceed 200% of sale price'
  },
  '95-percent': {
    type: '95-percent',
    description: '95% Rule',
    requirements: 'Identify any number of properties but must purchase 95% of identified value'
  }
};

/**
 * Calculate all critical deadlines based on sale date
 */
export function calculateDeadlines(saleDate: string): ExchangeTimeline {
  const sale = new Date(saleDate);
  const now = new Date();
  
  // Calculate deadlines
  const identificationDeadline = new Date(sale);
  identificationDeadline.setDate(identificationDeadline.getDate() + 45);
  
  const purchaseDeadline = new Date(sale);
  purchaseDeadline.setDate(purchaseDeadline.getDate() + 180);
  
  // Calculate days
  const daysElapsed = Math.floor((now.getTime() - sale.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilIdentification = Math.floor((identificationDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilPurchase = Math.floor((purchaseDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Determine status
  let status: ExchangeTimeline['status'] = 'pending';
  if (now < sale) {
    status = 'pending';
  } else if (now > purchaseDeadline) {
    status = 'expired';
  } else if (now > identificationDeadline) {
    status = 'identified';
  } else {
    status = 'active';
  }
  
  return {
    saleDate: formatDate(sale),
    identificationDeadline: formatDate(identificationDeadline),
    purchaseDeadline: formatDate(purchaseDeadline),
    daysElapsed: Math.max(0, daysElapsed),
    daysUntilIdentification,
    daysUntilPurchase,
    status
  };
}

/**
 * Get remaining days with proper formatting
 */
export function getDaysRemaining(deadline: string, currentDate: Date = new Date()): {
  days: number;
  isOverdue: boolean;
  displayText: string;
} {
  const deadlineDate = new Date(deadline);
  const days = Math.floor((deadlineDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = days < 0;
  
  let displayText: string;
  if (isOverdue) {
    displayText = `${Math.abs(days)} days overdue`;
  } else if (days === 0) {
    displayText = 'Today!';
  } else if (days === 1) {
    displayText = '1 day remaining';
  } else {
    displayText = `${days} days remaining`;
  }
  
  return { days, isOverdue, displayText };
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format date with day of week
 */
export function formatDateLong(date: string): string {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return d.toLocaleDateString('en-US', options);
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(saleDate: string, currentDate: Date = new Date()): {
  overall: number;
  identification: number;
  purchase: number;
} {
  const timeline = calculateDeadlines(saleDate);
  const sale = new Date(saleDate);
  const identification = new Date(timeline.identificationDeadline);
  const purchase = new Date(timeline.purchaseDeadline);
  
  // Overall progress (0-180 days)
  const totalDays = 180;
  const daysElapsed = Math.floor((currentDate.getTime() - sale.getTime()) / (1000 * 60 * 60 * 24));
  const overall = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
  
  // Identification progress (0-45 days)
  const idDays = 45;
  const idProgress = Math.min(100, Math.max(0, (daysElapsed / idDays) * 100));
  
  // Purchase progress (45-180 days)
  let purchaseProgress = 0;
  if (daysElapsed > 45) {
    const purchaseDays = 135; // 180 - 45
    const purchaseElapsed = daysElapsed - 45;
    purchaseProgress = Math.min(100, Math.max(0, (purchaseElapsed / purchaseDays) * 100));
  }
  
  return {
    overall,
    identification: idProgress,
    purchase: purchaseProgress
  };
}

/**
 * Validate property identification against rules
 */
export function validateIdentification(
  properties: Property[],
  rule: IdentificationRule,
  salePrice?: number
): {
  isValid: boolean;
  message: string;
} {
  const identifiedProperties = properties.filter(p => p.status === 'identified');
  
  switch (rule.type) {
    case '3-property':
      if (identifiedProperties.length > 3) {
        return {
          isValid: false,
          message: 'You can only identify up to 3 properties with the 3-Property Rule'
        };
      }
      return {
        isValid: true,
        message: `${identifiedProperties.length} of 3 properties identified`
      };
      
    case '200-percent':
      if (!salePrice) {
        return {
          isValid: true,
          message: 'Enter sale price to validate 200% rule'
        };
      }
      const totalValue = identifiedProperties.reduce((sum, p) => sum + (p.value || 0), 0);
      const maxValue = salePrice * 2;
      if (totalValue > maxValue) {
        return {
          isValid: false,
          message: `Total value ($${totalValue.toLocaleString()}) exceeds 200% of sale price ($${maxValue.toLocaleString()})`
        };
      }
      return {
        isValid: true,
        message: `Total value: $${totalValue.toLocaleString()} of $${maxValue.toLocaleString()} maximum`
      };
      
    case '95-percent':
      const identifiedValue = identifiedProperties.reduce((sum, p) => sum + (p.value || 0), 0);
      const purchasedValue = properties
        .filter(p => p.status === 'purchased')
        .reduce((sum, p) => sum + (p.value || 0), 0);
      const requiredValue = identifiedValue * 0.95;
      
      return {
        isValid: purchasedValue >= requiredValue,
        message: `Must purchase $${requiredValue.toLocaleString()} (95% of identified value)`
      };
      
    default:
      return {
        isValid: true,
        message: 'Unknown identification rule'
      };
  }
}

/**
 * Generate reminder schedule
 */
export function generateReminderSchedule(timeline: ExchangeTimeline): {
  date: string;
  type: 'identification' | 'purchase';
  daysBeforeDeadline: number;
  message: string;
}[] {
  const reminders = [];
  
  // Identification reminders
  const idDeadline = new Date(timeline.identificationDeadline);
  
  // 30 days before
  const id30Days = new Date(idDeadline);
  id30Days.setDate(id30Days.getDate() - 30);
  if (id30Days > new Date()) {
    reminders.push({
      date: formatDate(id30Days),
      type: 'identification' as const,
      daysBeforeDeadline: 30,
      message: '30 days to identify replacement properties'
    });
  }
  
  // 14 days before
  const id14Days = new Date(idDeadline);
  id14Days.setDate(id14Days.getDate() - 14);
  if (id14Days > new Date()) {
    reminders.push({
      date: formatDate(id14Days),
      type: 'identification' as const,
      daysBeforeDeadline: 14,
      message: '2 weeks to identify replacement properties'
    });
  }
  
  // 7 days before
  const id7Days = new Date(idDeadline);
  id7Days.setDate(id7Days.getDate() - 7);
  if (id7Days > new Date()) {
    reminders.push({
      date: formatDate(id7Days),
      type: 'identification' as const,
      daysBeforeDeadline: 7,
      message: '1 week to identify replacement properties'
    });
  }
  
  // 1 day before
  const id1Day = new Date(idDeadline);
  id1Day.setDate(id1Day.getDate() - 1);
  if (id1Day > new Date()) {
    reminders.push({
      date: formatDate(id1Day),
      type: 'identification' as const,
      daysBeforeDeadline: 1,
      message: 'URGENT: Identification deadline tomorrow!'
    });
  }
  
  // Purchase reminders
  const purchaseDeadline = new Date(timeline.purchaseDeadline);
  
  // 60 days before
  const purchase60Days = new Date(purchaseDeadline);
  purchase60Days.setDate(purchase60Days.getDate() - 60);
  if (purchase60Days > new Date()) {
    reminders.push({
      date: formatDate(purchase60Days),
      type: 'purchase' as const,
      daysBeforeDeadline: 60,
      message: '60 days to complete purchase'
    });
  }
  
  // 30 days before
  const purchase30Days = new Date(purchaseDeadline);
  purchase30Days.setDate(purchase30Days.getDate() - 30);
  if (purchase30Days > new Date()) {
    reminders.push({
      date: formatDate(purchase30Days),
      type: 'purchase' as const,
      daysBeforeDeadline: 30,
      message: '30 days to complete purchase'
    });
  }
  
  // 14 days before
  const purchase14Days = new Date(purchaseDeadline);
  purchase14Days.setDate(purchase14Days.getDate() - 14);
  if (purchase14Days > new Date()) {
    reminders.push({
      date: formatDate(purchase14Days),
      type: 'purchase' as const,
      daysBeforeDeadline: 14,
      message: '2 weeks to complete purchase'
    });
  }
  
  // 7 days before
  const purchase7Days = new Date(purchaseDeadline);
  purchase7Days.setDate(purchase7Days.getDate() - 7);
  if (purchase7Days > new Date()) {
    reminders.push({
      date: formatDate(purchase7Days),
      type: 'purchase' as const,
      daysBeforeDeadline: 7,
      message: '1 week to complete purchase'
    });
  }
  
  return reminders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}