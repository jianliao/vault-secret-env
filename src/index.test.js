const { resolve } = require('path');

describe('Setup process.env with Vault Secrets', () => {
  const { jest } = require('@jest/globals');

  beforeEach(async () => {
    jest.resetModules();
    // Clears all the targets env vars - see src/fixtures/basic/VaultEnv
    delete process.env.PORT;
    delete process.env.PUBLIC_URL;
    delete process.env.DB_CLIENT;
    delete process.env.DB_DATABASE;
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    delete process.env.DB_SSL;

    delete process.env.CACHE_ENABLED;

    delete process.env.STORAGE_LOCAL_DRIVER;
    delete process.env.STORAGE_LOCAL_ROOT;
    delete process.env.STORAGE_LOCATIONS;

    delete process.env.RATE_LIMITER_DURATION;
    delete process.env.RATE_LIMITER_ENABLED;
    delete process.env.RATE_LIMITER_POINTS;
    delete process.env.RATE_LIMITER_STORE;

    // Preset the token role
    process.env.VAULT_TOKEN_ROLE = 'dme_spectrum_cms';
  });

  test('should get all the vault secrets set as environment variables', async () => {
    process.env.VAULT_ENV_PATH = resolve('./src/fixtures/basic');

    require('./index');

    expect(process.env.PORT).toBe('8055');
    expect(process.env.STORAGE_LOCAL_ROOT).toBe('./uploads');
    expect(process.env.STORAGE_LOCATIONS).toBe('local');
    expect(process.env.DB_DATABASE).toBe('sdscms');
    expect(process.env.DB_SSL).toBe('false');
    expect(process.env.DB_CLIENT).toBe('pg');
  });

  test('should not override if environment variable already existed', async () => {
    // Pre-setup one env var
    process.env.DB_DATABASE = 'mysql';
    process.env.VAULT_ENV_PATH = resolve('./src/fixtures/basic');

    require('./index');

    expect(process.env.DB_DATABASE).toBe('mysql');
  });

  test('should work with fallback VaultEnv', async () => {
    process.env.VAULT_ENV_PATH = resolve('./src/fixtures/fallback');

    require('./index');

    expect(process.env.PORT).toBe('8055');
    expect(process.env.PUBLIC_URL).toBe('https://spectrum-directus.corp.adobe.com');
    expect(process.env.RATE_LIMITER_DURATION).toBe('1');
    expect(process.env.RATE_LIMITER_ENABLED).toBe('false');
    expect(process.env.RATE_LIMITER_POINTS).toBe('25');
    expect(process.env.RATE_LIMITER_STORE).toBe('memory');
  });

  test('should work with root token only', async () => {
    delete process.env.VAULT_TOKEN_ROLE; // Delete token role pre-set in beforeEach callback
    process.env.VAULT_ENV_PATH = resolve('./src/fixtures/basic');

    require('./index');

    expect(process.env.PORT).toBe('8055');
    expect(process.env.STORAGE_LOCAL_ROOT).toBe('./uploads');
    expect(process.env.STORAGE_LOCATIONS).toBe('local');
    expect(process.env.DB_DATABASE).toBe('sdscms');
    expect(process.env.DB_SSL).toBe('false');
    expect(process.env.DB_CLIENT).toBe('pg');
  });

  test('should not set up env var that does not exist in Vault', async () => {
    process.env.VAULT_ENV_PATH = resolve('./src/fixtures/integration');

    require('./index');

    expect(process.env.UNKNOWN).toBeUndefined();
  });

  test('should support mix secret keys scenario', async () => {
    process.env.VAULT_ENV_PATH = resolve('./src/fixtures/advanced');

    require('./index');

    expect(process.env.PORT).toBe('8055');
    expect(process.env.PUBLIC_URL).toBe('https://spectrum-directus.corp.adobe.com');
    expect(process.env.RATE_LIMITER_DURATION).toBe('1');
    expect(process.env.RATE_LIMITER_ENABLED).toBe('false');
    expect(process.env.RATE_LIMITER_POINTS).toBe('25');
    expect(process.env.RATE_LIMITER_STORE).toBe('memory');
  });
});
