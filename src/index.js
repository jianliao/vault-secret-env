const colors = require('colors');
const dotenv = require('dotenv');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const { parseVaultEnv } = require('./util/parse-vaultenv');
const { getVaultSecretsSync } = require('./core');

colors.enable();

const vaultAddr = process.env.VAULT_ADDR || 'https://vault-amer.adobe.net';
const rootToken = process.env.VAULT_ROOT_TOKEN;
const tokenRole = process.env.VAULT_TOKEN_ROLE;
const tokenRoleTTL = process.env.VAULT_TOKEN_ROLE_TTL;
const vaultEnvDefinitionPath = process.env.VAULT_ENV_PATH || process.cwd();

const vaultSecretsDefinitions = dotenv.parse(readFileSync(resolve(vaultEnvDefinitionPath, 'VaultEnv')));

const secretsByPath = parseVaultEnv(vaultSecretsDefinitions);

const secretsKV = getVaultSecretsSync(vaultAddr, rootToken, secretsByPath, tokenRole, tokenRoleTTL);

for (const secretPath in secretsByPath) {
  const existInEnv = [];
  const setToEnv = [];
  const notFoundInVault = [];
  for (const key in secretsByPath[secretPath]) {
    const value = secretsKV[key];
    if (value) {
      if (process.env[key]) {
        existInEnv.push(key);
      }
      else {
        process.env[key] = value;
        setToEnv.push(key);
      }
    }
    else {
      notFoundInVault.push(key);
    }
  }
  if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() !== 'production') {
    console.log(`Vault path: ${secretPath}`.bold.white);
    setToEnv.length > 0 && console.log(`Setup in process.env: ${setToEnv} ✓`.green);
    existInEnv.length > 0 && console.log(`Exist in process.env: ${existInEnv} !`.bold.yellow);
    notFoundInVault.length > 0 && console.log(`Not found in Vault:   ${notFoundInVault} x`.bold.red);
  }
}
