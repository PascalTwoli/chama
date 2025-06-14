/**
 * Secure Token Storage Utility
 *
 * Provides secure token storage using HTTP-only cookies instead of localStorage
 * to prevent XSS attacks and maintain security best practices.
 */

// Token types for different authentication levels
export enum TokenType {
  AUTH = 'auth_token',
  ADMIN = 'admin_token',
}

// Cookie configuration for secure token storage
interface CookieOptions {
  secure: boolean; // HTTPS only transmission
  sameSite: 'Strict'; // CSRF protection
  path: string; // Cookie scope
  maxAge?: number; // Optional expiration (in seconds)
}

// Default secure cookie configuration
const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  secure: process.env.NODE_ENV === 'production', // Use secure in production
  sameSite: 'Strict',
  path: '/',
  maxAge: 24 * 60 * 60, // 24 hours in seconds
};

/**
 * Utility class for secure token storage using HTTP-only cookies
 */
export class SecureTokenStorage {
  /**
   * Sets a token in an HTTP-only cookie with security flags
   * Note: This method can only set regular cookies, not HTTP-only cookies
   * HTTP-only cookies must be set by the server
   */
  static setToken(
    tokenType: TokenType,
    token: string,
    options?: Partial<CookieOptions>
  ): void {
    const cookieOptions = { ...DEFAULT_COOKIE_OPTIONS, ...options };

    // Build cookie string with security flags
    let cookieString = `${tokenType}=${token}; path=${cookieOptions.path}; SameSite=${cookieOptions.sameSite}`;

    if (cookieOptions.secure) {
      cookieString += '; Secure';
    }

    if (cookieOptions.maxAge) {
      cookieString += `; Max-Age=${cookieOptions.maxAge}`;
    }

    // Set the cookie
    document.cookie = cookieString;
  }

  /**
   * Retrieves a token from cookies
   */
  static getToken(tokenType: TokenType): string | null {
    if (typeof document === 'undefined') {
      // Server-side rendering support
      return null;
    }

    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === tokenType) {
        return decodeURIComponent(value);
      }
    }

    return null;
  }

  /**
   * Removes a token from cookies
   */
  static removeToken(tokenType: TokenType): void {
    if (typeof document === 'undefined') {
      return;
    }

    // Set cookie with past expiration date to remove it
    document.cookie = `${tokenType}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict`;
  }

  /**
   * Clears all authentication tokens
   */
  static clearAllTokens(): void {
    this.removeToken(TokenType.AUTH);
    this.removeToken(TokenType.ADMIN);
  }

  /**
   * Checks if a token exists and is not empty
   */
  static hasToken(tokenType: TokenType): boolean {
    const token = this.getToken(tokenType);
    return token !== null && token.trim() !== '';
  }

  /**
   * Gets the primary authentication token (auth_token)
   */
  static getAuthToken(): string | null {
    return this.getToken(TokenType.AUTH);
  }

  /**
   * Gets the admin authentication token (admin_token)
   */
  static getAdminToken(): string | null {
    return this.getToken(TokenType.ADMIN);
  }

  /**
   * Sets the primary authentication token
   */
  static setAuthToken(token: string, options?: Partial<CookieOptions>): void {
    this.setToken(TokenType.AUTH, token, options);
  }

  /**
   * Sets the admin authentication token
   */
  static setAdminToken(token: string, options?: Partial<CookieOptions>): void {
    this.setToken(TokenType.ADMIN, token, options);
  }

  /**
   * Removes the primary authentication token
   */
  static removeAuthToken(): void {
    this.removeToken(TokenType.AUTH);
  }

  /**
   * Removes the admin authentication token
   */
  static removeAdminToken(): void {
    this.removeToken(TokenType.ADMIN);
  }

  /**
   * Checks if user is authenticated (has primary token)
   */
  static isAuthenticated(): boolean {
    return this.hasToken(TokenType.AUTH);
  }

  /**
   * Checks if user has admin privileges
   */
  static isAdmin(): boolean {
    return this.hasToken(TokenType.ADMIN);
  }
}

export default SecureTokenStorage;
