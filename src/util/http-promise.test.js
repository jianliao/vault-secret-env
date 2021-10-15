const { request } = require('./http-promise');

describe('Https basic scenarios', () => {
  test('should be able to consume json response', async () => {
    const res = await request(
      `${process.env.VAULT_ADDR}/v1/sys/mounts`,
      { 'X-Vault-Token': process.env.VAULT_ROOT_TOKEN }
    );
    expect(res.data['dme_spectrum/'].type).toBe('kv');
  });

  test('should consume text/html response', async () => {
    const res = await request(
      'https://spectrum.adobe.com'
    );
    expect(res).toMatch(/Spectrum/);
  });

  test('unsupported protocol should throw', async () => {
    try {
      await request('ftp://10.51.242.206/static');
    } catch (e) {
      expect(e.message).toBe('Unsupported protocol ftp: found');
    }
  });

  test('http post should work', async () => {
    const res = await request(
      `${process.env.VAULT_ADDR}/v1/sys/auth/${Date.now()}`,
      { 'X-Vault-Token': process.env.VAULT_ROOT_TOKEN },
      'POST',
      JSON.stringify({
        type: 'github',
        description: 'Login with GitHub'
      })
    );
    expect(res).toBe('');
  });

  test('server side error should throw http status code', async () => {
    try {
      await request(
        `${process.env.VAULT_ADDR}/v1/sys/mounts`,
        { 'X-Vault-Token': process.env.VAULT_ROOT_TOKEN },
        'POST',
        {}
      );
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
  });
});
