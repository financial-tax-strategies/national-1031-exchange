// ============================================
// Encryption Utilities
// National 1031 Center - Data Security
// ============================================

import CryptoJS from 'crypto-js';

// ============================================
// Encryption Key Management
// ============================================

/**
 * Generate a unique encryption key based on browser fingerprint
 * This provides a reasonable level of security for client-side storage
 */
function getEncryptionKey(): string {
  // Combine multiple browser properties to create a unique key
  const userAgent = navigator.userAgent || '';
  const language = navigator.language || '';
  const platform = navigator.platform || '';
  const screenResolution = `${screen.width}x${screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  
  // Create a composite key from browser properties
  const compositeKey = `${userAgent}-${language}-${platform}-${screenResolution}-${timezone}`;
  
  // Hash the composite key to create a consistent encryption key
  return CryptoJS.SHA256(compositeKey).toString();
}

// ============================================
// Sensitive Field Detection
// ============================================

/**
 * List of fields that contain sensitive information
 */
const SENSITIVE_FIELDS = [
  '1031x_email',
  '1031x_phone',
  '1031x_property_address',
  '1031x_cpa_email',
  '1031x_realtor_email',
  '1031x_additional_notes'
];

/**
 * Check if a field contains sensitive data
 */
function isSensitiveField(fieldName: string): boolean {
  return SENSITIVE_FIELDS.includes(fieldName);
}

// ============================================
// Encryption Functions
// ============================================

/**
 * Encrypt sensitive form data
 */
export function encryptFormData(data: Record<string, any>): string {
  try {
    const key = getEncryptionKey();
    
    // Create a copy of the data with sensitive fields encrypted
    const processedData = { ...data };
    
    Object.keys(processedData).forEach(fieldName => {
      if (isSensitiveField(fieldName) && processedData[fieldName]) {
        // Encrypt sensitive fields individually
        const encrypted = CryptoJS.AES.encrypt(
          JSON.stringify(processedData[fieldName]),
          key
        ).toString();
        
        processedData[fieldName] = {
          _encrypted: true,
          value: encrypted
        };
      }
    });
    
    // Encrypt the entire object for additional security
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(processedData),
      key
    ).toString();
    
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt form data');
  }
}

/**
 * Decrypt form data
 */
export function decryptFormData(encryptedData: string): Record<string, any> {
  try {
    const key = getEncryptionKey();
    
    // Decrypt the main object
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedText) {
      throw new Error('Failed to decrypt data');
    }
    
    const processedData = JSON.parse(decryptedText);
    
    // Decrypt individual sensitive fields
    Object.keys(processedData).forEach(fieldName => {
      if (
        processedData[fieldName] && 
        typeof processedData[fieldName] === 'object' && 
        processedData[fieldName]._encrypted
      ) {
        const fieldDecryptedBytes = CryptoJS.AES.decrypt(
          processedData[fieldName].value,
          key
        );
        const fieldDecryptedText = fieldDecryptedBytes.toString(CryptoJS.enc.Utf8);
        
        if (fieldDecryptedText) {
          processedData[fieldName] = JSON.parse(fieldDecryptedText);
        } else {
          // If decryption fails, remove the field to prevent data corruption
          delete processedData[fieldName];
        }
      }
    });
    
    return processedData;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt form data');
  }
}

// ============================================
// Secure Storage Functions
// ============================================

interface SecureStorageData {
  data: string;
  timestamp: number;
  version: string;
  checksum: string;
}

/**
 * Save encrypted data to localStorage with integrity check
 */
export function saveSecureData(key: string, data: any): void {
  try {
    const encrypted = encryptFormData(data);
    
    // Create checksum for integrity verification
    const checksum = CryptoJS.SHA256(encrypted).toString();
    
    const storageData: SecureStorageData = {
      data: encrypted,
      timestamp: Date.now(),
      version: '1.0',
      checksum
    };
    
    localStorage.setItem(key, JSON.stringify(storageData));
  } catch (error) {
    console.error('Error saving secure data:', error);
    // Don't throw - gracefully degrade to no persistence
  }
}

/**
 * Load and decrypt data from localStorage
 */
export function loadSecureData(key: string): any | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const storageData: SecureStorageData = JSON.parse(stored);
    
    // Verify data integrity
    const checksum = CryptoJS.SHA256(storageData.data).toString();
    if (checksum !== storageData.checksum) {
      console.error('Data integrity check failed');
      localStorage.removeItem(key);
      return null;
    }
    
    // Check if data is expired (24 hours)
    const maxAge = 24 * 60 * 60 * 1000;
    if (Date.now() - storageData.timestamp > maxAge) {
      localStorage.removeItem(key);
      return null;
    }
    
    return decryptFormData(storageData.data);
  } catch (error) {
    console.error('Error loading secure data:', error);
    // Remove corrupted data
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Clear secure data from localStorage
 */
export function clearSecureData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing secure data:', error);
  }
}

// ============================================
// Privacy Utilities
// ============================================

/**
 * Mask sensitive data for display
 */
export function maskSensitiveData(value: string, type: 'email' | 'phone' | 'text'): string {
  if (!value) return '';
  
  switch (type) {
    case 'email':
      const [localPart, domain] = value.split('@');
      if (!domain) return value;
      const maskedLocal = localPart.substring(0, 2) + '***';
      return `${maskedLocal}@${domain}`;
      
    case 'phone':
      // Keep last 4 digits visible
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length < 4) return value;
      return `(***) ***-${cleaned.slice(-4)}`;
      
    case 'text':
      // Show first 3 and last 3 characters
      if (value.length <= 6) return '***';
      return `${value.substring(0, 3)}***${value.slice(-3)}`;
      
    default:
      return value;
  }
}

/**
 * Check if browser supports required crypto APIs
 */
export function isEncryptionSupported(): boolean {
  try {
    // Test if crypto operations work
    const testData = 'test';
    const encrypted = CryptoJS.AES.encrypt(testData, 'test-key').toString();
    const decrypted = CryptoJS.AES.decrypt(encrypted, 'test-key').toString(CryptoJS.enc.Utf8);
    
    return decrypted === testData && typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}