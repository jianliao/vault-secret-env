import { execFileSync } from 'child_process';
import { join } from 'path';

async function getVaultSecrets(vaultAddr, rootToken, secretsByPath, tokenRole = null, ttl = 60) {
  let token = rootToken;
  if (tokenRole) {
    const res = await fetch(
      `${vaultAddr}/v1/auth/token/create/${tokenRole}`,
      {
        headers: { 'X-Vault-Token': rootToken },
        method: 'POST',
        body: ttl ? JSON.stringify({ ttl }) : null
      });
    if (res.ok) {
      const { auth: { client_token } } = await res.json();
      token = client_token;
    } else {
      return Promise.reject('Unable to retrieve role token.');
    }
  }

  const secretsKV = {};

  for (let secretPath in secretsByPath) {
    secretPath = secretPath.endsWith('/') ? secretPath.slice(0, -1) : secretPath; // remove last slash

    let { data } = JSON.parse(sendMessage({
      url: `${vaultAddr}/v1/${secretPath}`,
      headers: { 'X-Vault-Token': token }
    }));

    if (data.data) {
      data = data.data;
    }

    for (const secretKey in secretsByPath[secretPath]) {
      const secretValue = data[secretKey];
      if (secretValue) {
        secretsKV[secretKey] = secretValue;
      }
    }
  }

  return secretsKV;
}

function getVaultSecretsSync(vaultAddr, rootToken, secretsByPath, tokenRole = null, ttl = 60) {
  let token = rootToken;
  if (tokenRole) {
    const { auth: { client_token } } = JSON.parse(sendMessage({
      url: `${vaultAddr}/v1/auth/token/create/${tokenRole}`,
      headers: { 'X-Vault-Token': rootToken },
      method: 'POST',
      body: ttl ? JSON.stringify({ ttl }) : null
    }));

    token = client_token;
  }

  const secretsKV = {};

  for (let secretPath in secretsByPath) {
    secretPath = secretPath.endsWith('/') ? secretPath.slice(0, -1) : secretPath; // remove last slash

    let { data } = JSON.parse(sendMessage({
      url: `${vaultAddr}/v1/${secretPath}`,
      headers: { 'X-Vault-Token': token }
    }));

    if (data.data) {
      data = data.data;
    }

    for (const secretKey in secretsByPath[secretPath]) {
      const secretValue = data[secretKey];
      if (secretValue) {
        secretsKV[secretKey] = secretValue;
      }
    }
  }

  return secretsKV;
}

function sendMessage(message) {
  return execFileSync(process.execPath, [join('src', 'worker.js')], {
    windowsHide: true,
    maxBuffer: Infinity,
    input: JSON.stringify(message),
    shell: false
  }).toString();
}

export { getVaultSecrets, getVaultSecretsSync }
