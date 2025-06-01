// Simple utility to check if we're in a browser environment
export const isBrowser = () => typeof window !== 'undefined';

// Checks if we're running on server or client
export const isServer = () => !isBrowser();

// Safe window object access
export const getWindow = () => (isBrowser() ? window : undefined);

// Safe document object access
export const getDocument = () => (isBrowser() ? document : undefined); 