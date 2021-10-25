# Vault Secrets to Environment Variables

Vault Env package provides a [dotenv](https://github.com/motdotla/dotenv) like usage experience. User defines [vault](https://www.vaultproject.io/) secrets with the .env file format. This package will pull the vault secrets into [process.env](https://nodejs.org/api/process.html#process_process_env).

## Installation
```bash
npm install vault-secret-env
```

## VaultEnv file

VaultEnv is like `.env` file and follows some of its basic [rules](https://github.com/motdotla/dotenv#rules):

> * BASIC=basic becomes {BASIC: 'basic'}
> * empty lines are skipped
> * lines beginning with # are treated as comments

For example:

```js
PORT=domain/data/cms/gm:PORT_NUMBER
PUBLIC_URL=domain/data/cms/gm:PUBLIC_URL_STR

DB_CLIENT=domain/data/cms/db:DB_CLIENT_TYPE
DB_DATABASE=domain/data/cms/db:DB_DATABASE_NAME
DB_HOST=domain/data/cms/db:DB_HOST_NAME
DB_PORT=domain/data/cms/db:DB_PORT_NUMBER
DB_SSL=domain/data/cms/db:DB_SSL_CERT
```

If the vault secret key name is identical to the environment variables, you can omit it. Below are the two identical configurations.

```js
PORT=domain/data/cms/gm:PORT
PUBLIC_URL=domain/data/cms/gm:PUBLIC_URL

DB_CLIENT=domain/data/cms/db:DB_CLIENT
DB_DATABASE=domain/data/cms/db:DB_DATABASE
DB_HOST=domain/data/cms/db:DB_HOST
DB_PORT=domain/data/cms/db:DB_PORT
DB_SSL=domain/data/cms/db:DB_SSL
```

```js
PORT=domain/data/cms/gm
PUBLIC_URL=domain/data/cms/gm

DB_CLIENT=domain/data/cms/db
DB_DATABASE=domain/data/cms/db
DB_HOST=domain/data/cms/db
DB_PORT=domain/data/cms/db
DB_SSL=domain/data/cms/db
```

VaultEnv file should put at the root of the project along with .env and package.json.

## Load vault secrets into nodejs process.env

Use it just like [dotenv](https://github.com/motdotla/dotenv) package, as early as possible in your application, require vault-secret-env.

```js
require('vault-secret-env');
```

Run the application with VAULT_ADDR and VAULT_ROOT_TOKEN

```bash
$ VAULT_ADDR=https://localhost:8000 VAULT_ROOT_TOKEN=MTIzNDU node app.js
```

Optionally specify the VAULT_TOKEN_ROLE and VAULT_TOKEN_ROLE_TTL to retrieve the vault secrets by token role and control the token TTL time.

```bash
$ VAULT_ADDR=https://localhost:8000 \
>  VAULT_ROOT_TOKEN=MTIzNDU \
>  VAULT_TOKEN_ROLE=power_user \
>  VAULT_TOKEN_ROLE_TTL=10s \
>  node app.js
```

## Command line interface

This package also provides a simple cli to validate the VaultEnv settings.

```bash
$ npx vault-env -a https://localhost:8000 -t MTIzNDU
```

Output

```bash
PORT : 8055 ✓
PUBLIC_URL : https://domain.com ✓
DB_CLIENT : pg ✓
DB_DATABASE : sdscms ✓
DB_HOST : db.domain.com ✓
DB_PORT : 5423 ✓
DB_SSL : false ✓
```

See more options by running with `-h` or `--help`.

```bash
$npx vault-env --help
Usage: vault-env [options]

Options:
  -V, --version                     output the version number
  -a, --address <url>               VAULT_ADDR, Vault server address, if not specified will try to retrieve it from the Node.js process environment
                                    variable.
  -t, --token <token>               VAULT_ROOT_TOKEN, root token.
  -tr, --token-role <role_name>     VAULT_TOKEN_ROLE, if specified, will try to retrieve the secrets with this role's token.
  -ttl, --token-role-ttl <seconds>  Time-to-Live for the role token. Default to be 60 seconds.
  -p, --path <path>                 Root path to locate VaultEnv file. Default to be current working directory of the Node.js process.
  -h, --help                        display help for command
```

## Implementation and testing
The core functionality of this package has zero dependency on any third-party package and all built from scratch. It supports both vault kv [version 1](https://www.vaultproject.io/api-docs/secret/kv/kv-v1) and [version 2](https://www.vaultproject.io/api-docs/secret/kv/kv-v2). The implementation relys on nodejs api [execFileSync](https://nodejs.org/api/child_process.html#child_processexecfilesyncfile-args-options).

To run the end-to-end test, you need to install vault dev server first, see [here](https://www.vaultproject.io/downloads) for more detail. The e2e test will spin up a vault dev server on port `8200`, please ensure the port is not in-use before the test.

```bash
$npm test
```
