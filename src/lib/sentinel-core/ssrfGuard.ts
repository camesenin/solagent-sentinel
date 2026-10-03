/**
 * SSRF (Server-Side Request Forgery) Firewall
 * 
 * Prevents attackers from using Sentinel's Blink/Action inspection endpoints
 * to scan internal networks, loopback addresses, or cloud metadata services (e.g. AWS 169.254.169.254).
 */

const PRIVATE_IP_PATTERNS = [
  /^127\./,                           // Loopback 127.0.0.0/8
  /^10\./,                            // Private RFC1918 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,   // Private RFC1918 172.16.0.0/12
  /^192\.168\./,                      // Private RFC1918 192.168.0.0/16
  /^169\.254\./,                      // Link-Local / Cloud Metadata 169.254.0.0/16
  /^0\.0\.0\.0/,                      // Zero address
  /^localhost$/i,                     // Localhost hostname
  /^::1$/,                            // IPv6 Loopback
  /^fe80:/i,                          // IPv6 Link-Local
];

export interface UrlValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  error?: string;
}

export function validateSafeExternalUrl(inputUrl: string): UrlValidationResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { isValid: false, error: 'URL must be a non-empty string' };
  }

  // Length limit
  if (inputUrl.length > 2048) {
    return { isValid: false, error: 'URL exceeds maximum length of 2048 characters' };
  }

  try {
    const parsed = new URL(inputUrl.trim());

    // Protocol enforcement: Only HTTPS allowed for remote Solana Actions / Blinks
    if (parsed.protocol !== 'https:') {
      return {
        isValid: false,
        error: `Insecure protocol '${parsed.protocol}'. Solana Actions strictly require HTTPS.`,
      };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check against private/loopback/cloud metadata patterns
    for (const pattern of PRIVATE_IP_PATTERNS) {
      if (pattern.test(hostname)) {
        return {
          isValid: false,
          error: `Access to internal/private destination '${hostname}' is blocked by Sentinel SSRF Firewall.`,
        };
      }
    }

    // Ensure no embedded credentials (e.g., https://user:pass@evil.com)
    if (parsed.username || parsed.password) {
      return {
        isValid: false,
        error: 'URLs containing embedded basic authentication credentials are not permitted.',
      };
    }

    return {
      isValid: true,
      sanitizedUrl: parsed.toString(),
    };
  } catch (err: any) {
    return {
      isValid: false,
      error: `Malformed URL: ${err.message || 'Failed to parse URI'}`,
    };
  }
}
