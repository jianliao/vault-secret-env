const execa = require('execa');

describe('CLI basic scenarios', () => {
  test('should exit with error if no VAULT_ROOT_TOKEN', async () => {
    try {
      await execa('node', ['src/cli'], { env: { 'VAULT_ROOT_TOKEN': undefined } })
    } catch (e) {
      expect(e.exitCode).toBe(1);
      expect(e.stdout).toMatch(/Missing root vault token./);
    }
  });

  test('should exit with error if no VaultEnv found', async () => {
    try {
      await execa('node', ['src/cli'], { env: { 'VAULT_ROOT_TOKEN': 'fakeToken' } });
    } catch (e) {
      expect(e.exitCode).toBe(1);
      expect(e.stdout).toMatch(/Missing VaultEnv file./);
    }
  });

  test('should exit with error if no VaultEnv found from env var', async () => {
    try {
      await execa('node', ['src/cli'], { env: { 'VAULT_ROOT_TOKEN': 'fakeToken', 'VAULT_ENV_PATH': 'src/util' } });
    } catch (e) {
      expect(e.exitCode).toBe(1);
      expect(e.stdout).toMatch(/Missing VaultEnv file./);
    }
  });

  test('should print out help info', async () => {
    const { exitCode, stdout } = await execa('node', ['src/cli', '-h'], { env: { 'VAULT_ROOT_TOKEN': 'fakeToken', 'VAULT_ENV_PATH': 'src/fixtures/basic' } });
    expect(exitCode).toBe(0);
    expect(stdout).toMatch(/Usage: cli/);
  });

  test('should print out all the secret kv', async () => {
    const { exitCode, stdout } = await execa('node', ['src/cli'], { env: { 'VAULT_ROOT_TOKEN': process.env.VAULT_ROOT_TOKEN, 'VAULT_ENV_PATH': 'src/fixtures/basic' } });
    expect(exitCode).toBe(0);
    expect(stdout).toMatch(/PORT : 8055/);
    expect(stdout).toMatch(/DB_CLIENT : pg/);
    expect(stdout).toMatch(/DB_DATABASE : sdscms/);
    expect(stdout).toMatch(/DB_HOST : domain.com/);
    expect(stdout).toMatch(/DB_PORT : 5423/);
  });

  test('should support specify root token and path from command line parameters', async () => {
    const { exitCode, stdout } = await execa('node', ['src/cli', '-t', process.env.VAULT_ROOT_TOKEN, '-p', 'src/fixtures/basic']);
    expect(exitCode).toBe(0);
    expect(stdout).toMatch(/PORT : 8055/);
    expect(stdout).toMatch(/DB_CLIENT : pg/);
    expect(stdout).toMatch(/DB_DATABASE : sdscms/);
    expect(stdout).toMatch(/DB_HOST : domain.com/);
    expect(stdout).toMatch(/DB_PORT : 5423/);
  });

  test('should support specify root token, token role and path from command line parameters', async () => {
    const { exitCode, stdout } = await execa('node', ['src/cli', '-t', process.env.VAULT_ROOT_TOKEN, '-p', 'src/fixtures/basic', '-tr', 'domain_cms']);
    expect(exitCode).toBe(0);
    expect(stdout).toMatch(/PORT : 8055/);
    expect(stdout).toMatch(/DB_CLIENT : pg/);
    expect(stdout).toMatch(/DB_DATABASE : sdscms/);
    expect(stdout).toMatch(/DB_HOST : domain.com/);
    expect(stdout).toMatch(/DB_PORT : 5423/);
  });

  test('should support specify token role ttl and path from command line parameters', async () => {
    const { exitCode, stdout } = await execa('node', ['src/cli', '-t', process.env.VAULT_ROOT_TOKEN, '-p', 'src/fixtures/basic', '-tr', 'domain_cms', '-ttl', '10']);
    expect(exitCode).toBe(0);
    expect(stdout).toMatch(/PORT : 8055/);
    expect(stdout).toMatch(/DB_CLIENT : pg/);
    expect(stdout).toMatch(/DB_DATABASE : sdscms/);
    expect(stdout).toMatch(/DB_HOST : domain.com/);
    expect(stdout).toMatch(/DB_PORT : 5423/);
  });

  test('should fail if specify wrong server address', async () => {
    try {
      await execa('node', ['src/cli', '-t', process.env.VAULT_ROOT_TOKEN, '-p', 'src/fixtures/basic', '-tr', 'domain_cms', '-a', 'abc']);
    }
    catch (e) {
      expect(e.toString()).toMatch(/Invalid URL/);
    }
  });
});
