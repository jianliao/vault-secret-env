#!/usr/bin/env node
'use strict';

const dotenv = require('dotenv');
const colors = require('colors');
const { existsSync, readFileSync } = require('fs');
const { resolve } = require('path');
const { Command } = require('commander');
const { exit } = require('process');
const { parseVaultEnv } = require('./util/parse-vaultenv');
const { getVaultSecrets } = require('./core');

colors.enable();

const program = new Command();

program.version(require('../package.json').version);

program
  .option('-a, --address <url>',
    'VAULT_ADDR, Vault server address, if not specified will try to retrieve it from the Node.js process environment variable.')
  .option('-t, --token <token>',
    'VAULT_ROOT_TOKEN, root token.')
  .option('-tr, --token-role <role_name>',
    'VAULT_TOKEN_ROLE, if specified, will try to retrieve the secrets with this role\'s token.')
  .option('-ttl, --token-role-ttl <seconds>',
    'Time-to-Live for the role token. Default to be 60 seconds.')
  .option('-p, --path <path>',
    'Root path to locate VaultEnv file. Default to be current working directory of the Node.js process.');

program.parse(process.argv);

const options = program.opts();

const VAULT_ADDR = options.address || process.env.VAULT_ADDR;
const VAULT_ROOT_TOKEN = options.token || process.env.VAULT_ROOT_TOKEN;
const VAULT_TOKEN_ROLE = options.tokenRole || process.env.VAULT_TOKEN_ROLE;
const VAULT_TOKEN_ROLE_TTL = options.tokenRoleTtl || process.env.VAULT_TOKEN_ROLE_TTL;
const VAULT_ENV_PATH = options.path || process.env.VAULT_ENV_PATH || process.cwd();

if (!VAULT_ROOT_TOKEN) {
  console.log('Missing root vault token.'.bold.red);
  exit(1);
}

if (!existsSync(resolve(VAULT_ENV_PATH, 'VaultEnv'))) {
  console.log('Missing VaultEnv file.'.bold.red);
  exit(1);
}

main();

async function main() {
  const vaultSecretsDefinitions = dotenv.parse(readFileSync(resolve(VAULT_ENV_PATH, 'VaultEnv')));
  const secretsByPath = parseVaultEnv(vaultSecretsDefinitions);

  const secretsKV = await getVaultSecrets(VAULT_ADDR, VAULT_ROOT_TOKEN, secretsByPath, VAULT_TOKEN_ROLE, VAULT_TOKEN_ROLE_TTL);
  for (const secretPath in secretsByPath) {
    for (const key in secretsByPath[secretPath]) {
      const value = secretsKV[key];
      if (value) {
        console.log(`${key} : ${value} ✓`.green);
      }
      else {
        console.log(`Secret key not found - ${key}  ✕`.bold.yellow);
      }
    }
  }
}
