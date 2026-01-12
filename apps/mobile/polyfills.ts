// Polyfills for Convex to work with React Native
// Must be imported before any Convex imports

import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
  // Convex uses these browser APIs that don't exist in React Native
  const g = global as any;
  
  if (typeof g.window === 'undefined') {
    g.window = g;
  }
  
  if (typeof g.window.addEventListener === 'undefined') {
    g.window.addEventListener = () => {};
  }
  
  if (typeof g.window.removeEventListener === 'undefined') {
    g.window.removeEventListener = () => {};
  }
}

export {};
