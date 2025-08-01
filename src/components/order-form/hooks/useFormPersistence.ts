// ============================================
// Form Persistence Hook
// National 1031 Center - Custom Hooks
// ============================================

import { useEffect, useCallback, useRef } from 'react';
import { saveSecureData, loadSecureData, clearSecureData, isEncryptionSupported } from '../../../lib/utils/encryption';

// ============================================
// Hook Configuration
// ============================================

interface UseFormPersistenceOptions {
  key: string;
  debounceMs?: number;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
  onLoadSuccess?: (data: any) => void;
  onLoadError?: (error: Error) => void;
}

interface UseFormPersistenceReturn {
  save: (data: any) => void;
  load: () => any | null;
  clear: () => void;
  isEncrypted: boolean;
  lastSaved: Date | null;
}

// ============================================
// Custom Hook
// ============================================

export function useFormPersistence(options: UseFormPersistenceOptions): UseFormPersistenceReturn {
  const {
    key,
    debounceMs = 1000,
    onSaveSuccess,
    onSaveError,
    onLoadSuccess,
    onLoadError
  } = options;
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<Date | null>(null);
  const isEncrypted = isEncryptionSupported();
  
  // ============================================
  // Save Function with Debouncing
  // ============================================
  
  const save = useCallback((data: any) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const dataWithMetadata = {
          ...data,
          _metadata: {
            savedAt: new Date().toISOString(),
            version: '1.0',
            encrypted: isEncrypted
          }
        };
        
        if (isEncrypted) {
          saveSecureData(key, dataWithMetadata);
        } else {
          // Fallback to regular localStorage
          localStorage.setItem(key, JSON.stringify(dataWithMetadata));
        }
        
        lastSavedRef.current = new Date();
        onSaveSuccess?.();
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Form data persisted', { encrypted: isEncrypted });
        }
      } catch (error) {
        console.error('Error persisting form data:', error);
        onSaveError?.(error as Error);
      }
    }, debounceMs);
  }, [key, debounceMs, isEncrypted, onSaveSuccess, onSaveError]);
  
  // ============================================
  // Load Function
  // ============================================
  
  const load = useCallback(() => {
    try {
      let loadedData: any = null;
      
      if (isEncrypted) {
        loadedData = loadSecureData(key);
      } else {
        // Fallback to regular localStorage
        const stored = localStorage.getItem(key);
        if (stored) {
          loadedData = JSON.parse(stored);
        }
      }
      
      if (loadedData) {
        // Extract metadata if present
        const { _metadata, ...actualData } = loadedData;
        
        if (_metadata?.savedAt) {
          lastSavedRef.current = new Date(_metadata.savedAt);
        }
        
        onLoadSuccess?.(actualData);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Form data loaded', { 
            encrypted: _metadata?.encrypted || false,
            savedAt: _metadata?.savedAt 
          });
        }
        
        return actualData;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading form data:', error);
      onLoadError?.(error as Error);
      return null;
    }
  }, [key, isEncrypted, onLoadSuccess, onLoadError]);
  
  // ============================================
  // Clear Function
  // ============================================
  
  const clear = useCallback(() => {
    // Cancel any pending saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    try {
      if (isEncrypted) {
        clearSecureData(key);
      } else {
        localStorage.removeItem(key);
      }
      
      lastSavedRef.current = null;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Form data cleared');
      }
    } catch (error) {
      console.error('Error clearing form data:', error);
    }
  }, [key, isEncrypted]);
  
  // ============================================
  // Cleanup on Unmount
  // ============================================
  
  useEffect(() => {
    return () => {
      // Clear any pending save timeouts
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);
  
  // ============================================
  // Return Hook Interface
  // ============================================
  
  return {
    save,
    load,
    clear,
    isEncrypted,
    lastSaved: lastSavedRef.current
  };
}

// ============================================
// Utility Hook for Auto-Save
// ============================================

interface UseAutoSaveOptions extends UseFormPersistenceOptions {
  data: any;
  enabled?: boolean;
  dependencies?: any[];
}

export function useAutoSave(options: UseAutoSaveOptions): UseFormPersistenceReturn {
  const {
    data,
    enabled = true,
    dependencies = [],
    ...persistenceOptions
  } = options;
  
  const persistence = useFormPersistence(persistenceOptions);
  
  // Auto-save when data changes
  useEffect(() => {
    if (enabled && data) {
      persistence.save(data);
    }
  }, [data, enabled, ...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps
  
  return persistence;
}