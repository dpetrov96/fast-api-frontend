/**
 * Utility functions for handling Supabase password reset flow
 */

export interface SupabaseResetTokens {
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  expires_in?: string;
  token_type?: string;
  type?: string;
}

/**
 * Parse Supabase reset tokens from URL hash fragment
 */
export function parseResetTokensFromUrl(): SupabaseResetTokens | null {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash;
  if (!hash) return null;

  try {
    // Parse URL fragment (everything after #)
    const params = new URLSearchParams(hash.substring(1));
    
    const tokens: SupabaseResetTokens = {
      access_token: params.get('access_token') || undefined,
      refresh_token: params.get('refresh_token') || undefined,
      expires_at: params.get('expires_at') || undefined,
      expires_in: params.get('expires_in') || undefined,
      token_type: params.get('token_type') || undefined,
      type: params.get('type') || undefined,
    };

    // Validate that we have the required tokens for password reset
    if (tokens.access_token && tokens.type === 'recovery') {
      return tokens;
    }

    return null;
  } catch (error) {
    console.error('Error parsing reset tokens from URL:', error);
    return null;
  }
}

/**
 * Clean the URL after extracting tokens
 */
export function cleanUrlAfterTokenExtraction(): void {
  if (typeof window === 'undefined') return;
  
  // Remove the hash fragment from URL without causing a page reload
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
}

/**
 * Check if the current URL contains Supabase reset tokens
 */
export function hasResetTokensInUrl(): boolean {
  if (typeof window === 'undefined') return false;
  
  const hash = window.location.hash;
  return hash.includes('access_token') && hash.includes('type=recovery');
}

/**
 * Validate reset token expiration
 */
export function isResetTokenExpired(tokens: SupabaseResetTokens): boolean {
  if (!tokens.expires_at) return false;
  
  const expirationTime = parseInt(tokens.expires_at) * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  
  return currentTime >= expirationTime;
}

/**
 * Get time remaining for reset token in minutes
 */
export function getTokenTimeRemaining(tokens: SupabaseResetTokens): number {
  if (!tokens.expires_at) return 0;
  
  const expirationTime = parseInt(tokens.expires_at) * 1000;
  const currentTime = Date.now();
  const timeRemaining = expirationTime - currentTime;
  
  return Math.max(0, Math.floor(timeRemaining / (1000 * 60))); // Convert to minutes
}