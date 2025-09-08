/**
 * Platform detection utilities
 * This module provides cross-platform compatibility between React Native and Web
 */

export interface PlatformSelectOptions<T> {
  web?: T;
  native?: T;
  ios?: T;
  android?: T;
  default?: T;
}

/**
 * Platform detection - works for both React Native and Web
 */
export const Platform = {
  OS: typeof window !== 'undefined' ? 'web' : 'native',
  
  /**
   * Select platform-specific values
   * Similar to React Native's Platform.select but works cross-platform
   */
  select: <T>(options: PlatformSelectOptions<T>): T => {
    const { web, native, ios, android, default: defaultValue } = options;
    
    if (typeof window !== 'undefined') {
      // Web environment
      return web ?? defaultValue!;
    }
    
    // React Native environment (we'll detect specific platforms when needed)
    // For now, we'll use native as fallback
    return native ?? ios ?? android ?? defaultValue!;
  },
  
  /**
   * Check if running on web
   */
  isWeb: () => typeof window !== 'undefined',
  
  /**
   * Check if running on React Native
   */
  isNative: () => typeof window === 'undefined',
};