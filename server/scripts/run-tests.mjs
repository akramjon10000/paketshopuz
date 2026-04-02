import assert from 'node:assert/strict';
import {
  createAdminToken,
  getAdminLoginThrottleState,
  recordFailedAdminLogin,
  requestHasValidAdminToken,
  resetFailedAdminLogins,
  verifyAdminToken,
} from '../dist/lib/adminAuth.js';
import {
  validateCreateOrderInput,
  validateCreateProductInput,
  validateOrderStatusInput,
} from '../dist/lib/validation.js';

function createRequest(ip, token) {
  return {
    headers: token ? { authorization: `Bearer ${token}` } : {},
    ip,
    socket: { remoteAddress: ip },
  };
}

const tests = [
  {
    name: 'validateCreateOrderInput accepts a valid order payload',
    run: () => {
      const result = validateCreateOrderInput({
        items: [
          {
            id: 'box1',
            name: 'Pitssa Qutisi 30sm',
            description: 'Test mahsulot',
            price: 1800,
            images: ['/images/boxes.png'],
            category: 'boxes',
            quantity: 2,
          },
        ],
        total: 3600,
        address: 'Toshkent sh.',
        phone: '+998901234567',
        customerName: 'Akramjon',
        paymentMethod: 'cash',
        comment: 'Tez yetkazing',
      });

      assert.equal(result.success, true);
      if (!result.success) {
        return;
      }

      assert.equal(result.data.items[0].quantity, 2);
      assert.equal(result.data.paymentMethod, 'cash');
    },
  },
  {
    name: 'validateCreateOrderInput rejects empty items',
    run: () => {
      const result = validateCreateOrderInput({
        items: [],
        total: 0,
        phone: '',
      });

      assert.deepEqual(result, {
        success: false,
        error: 'items must be a non-empty array',
      });
    },
  },
  {
    name: 'validateCreateProductInput rejects invalid category',
    run: () => {
      const result = validateCreateProductInput({
        id: 'bad-1',
        name: 'Noto‘g‘ri mahsulot',
        price: 1000,
        category: 'unknown',
      });

      assert.deepEqual(result, {
        success: false,
        error: 'category is invalid',
      });
    },
  },
  {
    name: 'validateOrderStatusInput accepts cancelled and rejects unknown status',
    run: () => {
      const validResult = validateOrderStatusInput('cancelled');
      assert.equal(validResult.success, true);

      const invalidResult = validateOrderStatusInput('archived');
      assert.deepEqual(invalidResult, {
        success: false,
        error: 'status is invalid',
      });
    },
  },
  {
    name: 'createAdminToken generates a verifiable token',
    run: () => {
      process.env.ADMIN_PASSWORD = 'TestPassword123!';
      process.env.ADMIN_SESSION_SECRET = 'test-session-secret';

      const token = createAdminToken();
      assert.equal(verifyAdminToken(token), true);

      const req = createRequest('198.51.100.10', token);
      assert.equal(requestHasValidAdminToken(req), true);
    },
  },
  {
    name: 'changing admin password invalidates old tokens',
    run: () => {
      process.env.ADMIN_PASSWORD = 'TestPassword123!';
      process.env.ADMIN_SESSION_SECRET = 'test-session-secret';

      const token = createAdminToken();
      process.env.ADMIN_PASSWORD = 'AnotherPassword456!';

      assert.equal(verifyAdminToken(token), false);
    },
  },
  {
    name: 'failed admin logins are throttled after the configured limit',
    run: () => {
      const req = createRequest('198.51.100.11');

      resetFailedAdminLogins(req);

      for (let attempt = 1; attempt < 5; attempt += 1) {
        const state = recordFailedAdminLogin(req);
        assert.equal(state.allowed, true);
      }

      const blockedState = recordFailedAdminLogin(req);
      assert.equal(blockedState.allowed, false);
      assert.equal(blockedState.remainingAttempts, 0);

      const throttleState = getAdminLoginThrottleState(req);
      assert.equal(throttleState.allowed, false);

      resetFailedAdminLogins(req);
    },
  },
];

let failed = 0;

for (const testCase of tests) {
  try {
    testCase.run();
    console.log(`PASS ${testCase.name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${testCase.name}`);
    console.error(error);
  }
}

if (failed > 0) {
  console.error(`\n${failed} test failed`);
  process.exit(1);
}

console.log(`\n${tests.length} test passed`);
