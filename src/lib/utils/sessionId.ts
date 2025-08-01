// ============================================
// Session ID Generator
// National 1031 Center - Utilities
// ============================================

/**
 * Generate a unique session ID for tracking form sessions
 * Format: timestamp-random-random
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random1 = Math.random().toString(36).substring(2, 9);
  const random2 = Math.random().toString(36).substring(2, 9);
  
  return `${timestamp}-${random1}-${random2}`;
}

/**
 * Validate session ID format
 */
export function isValidSessionId(sessionId: string): boolean {
  const pattern = /^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/;
  return pattern.test(sessionId);
}

/**
 * Get session timestamp from session ID
 */
export function getSessionTimestamp(sessionId: string): Date | null {
  if (!isValidSessionId(sessionId)) {
    return null;
  }
  
  const [timestampStr] = sessionId.split('-');
  const timestamp = parseInt(timestampStr, 36);
  
  if (isNaN(timestamp)) {
    return null;
  }
  
  return new Date(timestamp);
}

/**
 * Check if session is expired (24 hours)
 */
export function isSessionExpired(sessionId: string): boolean {
  const timestamp = getSessionTimestamp(sessionId);
  if (!timestamp) {
    return true;
  }
  
  const now = Date.now();
  const sessionAge = now - timestamp.getTime();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  return sessionAge > maxAge;
}