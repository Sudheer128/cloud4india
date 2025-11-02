// Authentication utilities
// Using SHA-256 for password hashing

import CryptoJS from 'crypto-js';

// Pre-computed hash of "admin123" using SHA-256
// In production, this should be done on the backend
const ADMIN_PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'; // SHA-256 hash of "admin123"
const ADMIN_USERNAME = 'admin';

/**
 * Hash a string using SHA-256
 */
function hashString(str) {
  return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
}

/**
 * Authenticate user credentials
 */
export function authenticate(username, password) {
  if (username !== ADMIN_USERNAME) {
    return false;
  }
  
  try {
    const passwordHash = hashString(password);
    return passwordHash === ADMIN_PASSWORD_HASH;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  const authData = localStorage.getItem('admin_auth');
  if (!authData) return false;
  
  try {
    const { timestamp } = JSON.parse(authData);
    // Session expires after 24 hours
    const sessionDuration = 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > sessionDuration) {
      localStorage.removeItem('admin_auth');
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Set authentication state
 */
export function setAuthenticated() {
  localStorage.setItem('admin_auth', JSON.stringify({
    username: ADMIN_USERNAME,
    timestamp: Date.now()
  }));
}

/**
 * Clear authentication state
 */
export function logout() {
  localStorage.removeItem('admin_auth');
}

/**
 * Get current authenticated user
 */
export function getCurrentUser() {
  const authData = localStorage.getItem('admin_auth');
  if (!authData) return null;
  
  try {
    const data = JSON.parse(authData);
    return data.username || null;
  } catch (error) {
    return null;
  }
}

