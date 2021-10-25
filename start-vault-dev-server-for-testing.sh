#!/bin/bash

# Start vault dev server in the background with fixed root token
# VAULT_UI=true nohup vault server -dev -dev-root-token-id="password" &
nohup vault server -dev -dev-root-token-id password >/dev/null 2>&1 &

sleep 5

# Setup vault dev server address as VAULT_ADDR
export VAULT_ADDR='http://127.0.0.1:8200'

# auth with root password
vault login password

# Enable v2 kv on path - domain
vault secrets enable -path=domain -version=2 kv

# Batch create secret kv from json files
vault kv put domain/cms/cache @./vault/cache.json

vault kv put domain/cms/db @./vault/db.json

vault kv put domain/cms/email @./vault/email.json

vault kv put domain/cms/ext @./vault/ext.json

vault kv put domain/cms/fs @./vault/fs.json

vault kv put domain/cms/gm @./vault/gm.json

vault kv put domain/cms/rl @./vault/rl.json

vault kv put domain/cms/sec @./vault/sec.json

vault kv put domain/cms/sso @./vault/sso.json

# Create policy - role_domain_cms
vault policy write role_domain_cms ./vault/policy-file.hcl

# Create token role - domain_cms
vault write auth/token/roles/domain_cms allowed_policies=role_domain_cms period=36h
