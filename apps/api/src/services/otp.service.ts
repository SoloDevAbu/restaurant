/**
 * Fake in-memory OTP service.
 *
 * Stores { code, expiresAt } keyed by phone number.
 * No real SMS is sent — the OTP is written to the server log so you can
 * copy it during development.  Swap `generateOtp` for a real SMS provider
 * (Twilio, MSG91, etc.) without touching any route code.
 */

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const OTP_LENGTH = 6;

interface OtpEntry {
  code: string;
  expiresAt: Date;
}

// In-memory store: phone → OTP entry
const otpStore = new Map<string, OtpEntry>();

function randomDigits(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

/**
 * Generate and store an OTP for the given phone number.
 * Returns the code (so you can log it or, in production, pass it to an SMS provider).
 */
export function generateOtp(phone: string): string {
  const code = randomDigits(OTP_LENGTH);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  otpStore.set(phone, { code, expiresAt });

  // DEV ONLY — never log OTPs in production
  console.log(
    `[OTP] phone=${phone}  code=${code}  expires=${expiresAt.toISOString()}`,
  );

  return code;
}

/**
 * Verify the supplied OTP for a phone number.
 * By default, deletes the entry on success (single-use).
 * If `keep = true`, the OTP remains in the store for a subsequent verification.
 */
export function verifyOtp(phone: string, code: string, keep: boolean = false): boolean {
  const entry = otpStore.get(phone);
  if (!entry) return false;
  if (entry.expiresAt < new Date()) {
    otpStore.delete(phone);
    return false;
  }
  if (entry.code !== code) return false;

  if (!keep) {
    otpStore.delete(phone); // single-use
  }
  return true;
}
