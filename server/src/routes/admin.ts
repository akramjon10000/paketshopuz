import { Router } from 'express';
import {
  createAdminToken,
  getAdminDisplayName,
  getAdminLoginThrottleState,
  hasConfiguredAdminPassword,
  isValidAdminPassword,
  recordFailedAdminLogin,
  resetFailedAdminLogins,
  requireAdmin,
} from '../lib/adminAuth.js';

const router = Router();

router.post('/login', (req, res) => {
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const throttleState = getAdminLoginThrottleState(req);

  if (!throttleState.allowed) {
    res.setHeader('Retry-After', throttleState.retryAfterSeconds.toString());
    res.status(429).json({
      error: `Too many login attempts. Try again in ${throttleState.retryAfterSeconds} seconds.`,
    });
    return;
  }

  if (!password) {
    res.status(400).json({ error: 'Password required' });
    return;
  }

  if (!hasConfiguredAdminPassword()) {
    res.status(503).json({ error: 'ADMIN_PASSWORD is not configured on the server' });
    return;
  }

  if (!isValidAdminPassword(password)) {
    const failedAttemptState = recordFailedAdminLogin(req);

    if (!failedAttemptState.allowed) {
      res.setHeader('Retry-After', failedAttemptState.retryAfterSeconds.toString());
      res.status(429).json({
        error: `Too many login attempts. Try again in ${failedAttemptState.retryAfterSeconds} seconds.`,
      });
      return;
    }

    res.status(401).json({
      error: 'Invalid password',
      remainingAttempts: failedAttemptState.remainingAttempts,
    });
    return;
  }

  resetFailedAdminLogins(req);

  res.json({
    success: true,
    token: createAdminToken(),
    user: {
      name: getAdminDisplayName(),
    },
  });
});

router.get('/session', requireAdmin, (_req, res) => {
  res.json({
    success: true,
    user: {
      name: getAdminDisplayName(),
    },
  });
});

export default router;
