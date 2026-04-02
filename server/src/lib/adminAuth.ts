import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const ADMIN_TOKEN_FUTURE_SKEW_MS = 1000 * 60 * 5;
const ADMIN_MAX_LOGIN_ATTEMPTS = Math.max(1, Number(process.env.ADMIN_MAX_LOGIN_ATTEMPTS || 5));
const ADMIN_LOGIN_WINDOW_MS = Math.max(1, Number(process.env.ADMIN_LOGIN_WINDOW_MINUTES || 15)) * 60 * 1000;
const failedLoginAttempts = new Map<string, { count: number; windowStartedAt: number; blockedUntil?: number }>();

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || '';
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || 'change-this-admin-session-secret';
}

export function getAdminDisplayName() {
  return process.env.ADMIN_NAME?.trim() || 'Akramjon (Admin)';
}

export function hasConfiguredAdminPassword() {
  return Boolean(getAdminPassword());
}

export function isValidAdminPassword(password: string) {
  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    return false;
  }

  const expected = Buffer.from(adminPassword);
  const actual = Buffer.from(password);

  if (expected.length !== actual.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, actual);
}

function getPasswordFingerprint() {
  return crypto
    .createHash('sha256')
    .update(getAdminPassword())
    .digest('hex');
}

function signIssuedAt(issuedAt: string) {
  return crypto
    .createHmac('sha256', getSessionSecret())
    .update(`admin:${issuedAt}:${getPasswordFingerprint()}`)
    .digest('hex');
}

export function createAdminToken() {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${signIssuedAt(issuedAt)}`;
}

export function verifyAdminToken(token: string) {
  if (!token) {
    return false;
  }

  const [issuedAt, signature] = token.split('.');
  if (!issuedAt || !signature) {
    return false;
  }

  const timestamp = Number(issuedAt);
  if (!Number.isFinite(timestamp)) {
    return false;
  }

  if (timestamp > Date.now() + ADMIN_TOKEN_FUTURE_SKEW_MS) {
    return false;
  }

  if (Date.now() - timestamp > ADMIN_SESSION_TTL_MS) {
    return false;
  }

  const expectedSignature = signIssuedAt(issuedAt);
  const expected = Buffer.from(expectedSignature);
  const actual = Buffer.from(signature);

  if (expected.length !== actual.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, actual);
}

function getBearerToken(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return '';
  }

  return authHeader.slice('Bearer '.length);
}

export function requestHasValidAdminToken(req: Request) {
  return verifyAdminToken(getBearerToken(req));
}

function getClientIdentifier(req: Request) {
  const forwardedFor = req.headers['x-forwarded-for'];
  const rawValue = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : typeof forwardedFor === 'string'
      ? forwardedFor.split(',')[0]
      : req.ip || req.socket.remoteAddress || 'unknown';

  return rawValue.trim();
}

function cleanupExpiredFailedLogins(now: number) {
  for (const [key, state] of failedLoginAttempts.entries()) {
    const windowExpired = now - state.windowStartedAt > ADMIN_LOGIN_WINDOW_MS;
    const blockExpired = !state.blockedUntil || state.blockedUntil <= now;

    if (windowExpired && blockExpired) {
      failedLoginAttempts.delete(key);
    }
  }
}

export function getAdminLoginThrottleState(req: Request) {
  const now = Date.now();
  cleanupExpiredFailedLogins(now);

  const state = failedLoginAttempts.get(getClientIdentifier(req));
  if (!state) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (state.blockedUntil && state.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((state.blockedUntil - now) / 1000),
    };
  }

  if (now - state.windowStartedAt > ADMIN_LOGIN_WINDOW_MS) {
    failedLoginAttempts.delete(getClientIdentifier(req));
    return { allowed: true, retryAfterSeconds: 0 };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function recordFailedAdminLogin(req: Request) {
  const key = getClientIdentifier(req);
  const now = Date.now();
  const currentState = failedLoginAttempts.get(key);

  if (!currentState || now - currentState.windowStartedAt > ADMIN_LOGIN_WINDOW_MS) {
    failedLoginAttempts.set(key, {
      count: 1,
      windowStartedAt: now,
    });
    return { allowed: true, retryAfterSeconds: 0, remainingAttempts: ADMIN_MAX_LOGIN_ATTEMPTS - 1 };
  }

  const nextCount = currentState.count + 1;
  if (nextCount >= ADMIN_MAX_LOGIN_ATTEMPTS) {
    const blockedUntil = now + ADMIN_LOGIN_WINDOW_MS;
    failedLoginAttempts.set(key, {
      count: nextCount,
      windowStartedAt: currentState.windowStartedAt,
      blockedUntil,
    });

    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((blockedUntil - now) / 1000),
      remainingAttempts: 0,
    };
  }

  failedLoginAttempts.set(key, {
    count: nextCount,
    windowStartedAt: currentState.windowStartedAt,
  });

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remainingAttempts: ADMIN_MAX_LOGIN_ATTEMPTS - nextCount,
  };
}

export function resetFailedAdminLogins(req: Request) {
  failedLoginAttempts.delete(getClientIdentifier(req));
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!requestHasValidAdminToken(req)) {
    res.status(401).json({ error: 'Admin authorization required' });
    return;
  }

  next();
}
