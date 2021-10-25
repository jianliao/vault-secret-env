const { parse } = require('dotenv');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const { parseVaultEnv } = require('./parse-vaultenv');

describe('Basic scenarios', () => {
  test('should be able to generate correct secrets by path data structure', () => {
    const VAULT_SECRETS = parse(readFileSync(resolve('src/fixtures/basic', 'VaultEnv')));

    const secretsByPath = parseVaultEnv(VAULT_SECRETS);

    expect(Object.keys(secretsByPath)).toHaveLength(4);

    expect(Object.keys(secretsByPath['domain/data/cms/gm'])).toHaveLength(2);
    expect('PORT' in secretsByPath['domain/data/cms/gm']).toBeTruthy();
    expect('PUBLIC_URL' in secretsByPath['domain/data/cms/gm']).toBeTruthy();

    expect(Object.keys(secretsByPath['domain/data/cms/db'])).toHaveLength(5);
    expect('DB_PORT' in secretsByPath['domain/data/cms/db']).toBeTruthy();

    expect(Object.keys(secretsByPath['domain/data/cms/cache'])).toHaveLength(1);
    expect('CACHE_ENABLED' in secretsByPath['domain/data/cms/cache']).toBeTruthy();

    expect(Object.keys(secretsByPath['domain/data/cms/fs'])).toHaveLength(3);
  });
});

describe('Environment variable name fall back as the secret key name', () => {
  test('secret key name should be optional', () => {
    const VAULT_SECRETS = parse(readFileSync(resolve('src/fixtures/fallback', 'VaultEnv')));

    const secretsByPath = parseVaultEnv(VAULT_SECRETS);

    expect(Object.keys(secretsByPath)).toHaveLength(2);

    expect(Object.keys(secretsByPath['domain/data/cms/gm'])).toHaveLength(2);
    expect('PORT' in secretsByPath['domain/data/cms/gm']).toBeTruthy();
    expect('PUBLIC_URL' in secretsByPath['domain/data/cms/gm']).toBeTruthy();

    expect(Object.keys(secretsByPath['domain/data/cms/rl'])).toHaveLength(4);
    expect('RATE_LIMITER_DURATION' in secretsByPath['domain/data/cms/rl']).toBeTruthy();
    expect('RATE_LIMITER_ENABLED' in secretsByPath['domain/data/cms/rl']).toBeTruthy();
    expect('RATE_LIMITER_POINTS' in secretsByPath['domain/data/cms/rl']).toBeTruthy();
    expect('RATE_LIMITER_STORE' in secretsByPath['domain/data/cms/rl']).toBeTruthy();
  });
});

describe('Environment variable name fall back as the secret key name mix', () => {
  test('optional secret key name can mixed', () => {
    const VAULT_SECRETS = parse(readFileSync(resolve('src/fixtures/advanced', 'VaultEnv')));

    const secretsByPath = parseVaultEnv(VAULT_SECRETS);

    expect(Object.keys(secretsByPath)).toHaveLength(2);

    expect(Object.keys(secretsByPath['domain/data/cms/gm'])).toHaveLength(2);
    expect('PORT' in secretsByPath['domain/data/cms/gm']).toBeTruthy();
    expect('PUBLIC_URL' in secretsByPath['domain/data/cms/gm']).toBeTruthy();

    expect(Object.keys(secretsByPath['domain/data/cms/rl'])).toHaveLength(4);
    expect('RATE_LIMITER_DURATION' in secretsByPath['domain/data/cms/rl']).toBeTruthy();
    expect('RATE_LIMITER_ENABLED' in secretsByPath['domain/data/cms/rl']).toBeTruthy();
    expect('RATE_LIMITER_POINTS' in secretsByPath['domain/data/cms/rl']).toBeTruthy();
    expect('RATE_LIMITER_STORE' in secretsByPath['domain/data/cms/rl']).toBeTruthy();
  });
});
