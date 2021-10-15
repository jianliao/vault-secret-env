# Vault Secrets to Environment Variables

Vault Env package provides a [dotenv](https://github.com/motdotla/dotenv) like usage experience. User defines [vault](https://www.vaultproject.io/) secrets with the .env file format. This package will pull the vault secrets into [process.env](https://nodejs.org/api/process.html#process_process_env) according to the configuration.

## VaultEnv file

VaultEnv is like a .env file and follows some of its basic [rules](https://github.com/motdotla/dotenv#rules):

* BASIC=basic becomes {BASIC: 'basic'}
* empty lines are skipped
* lines beginning with # are treated as comments

For example:

```js
PORT=dme_spectrum/data/cms/gm:PORT_NUMBER
PUBLIC_URL=dme_spectrum/data/cms/gm:PUBLIC_URL_STR

DB_CLIENT=dme_spectrum/data/cms/db:DB_CLIENT_TYPE
DB_DATABASE=dme_spectrum/data/cms/db:DB_DATABASE_NAME
DB_HOST=dme_spectrum/data/cms/db:DB_HOST_NAME
DB_PORT=dme_spectrum/data/cms/db:DB_PORT_NUMBER
DB_SSL=dme_spectrum/data/cms/db:DB_SSL_CERT
```

If the vault secret key name is identical to the environment variables, you omit it. Below are two identical configurations.

```js
PORT=dme_spectrum/data/cms/gm:PORT
PUBLIC_URL=dme_spectrum/data/cms/gm:PUBLIC_URL

DB_CLIENT=dme_spectrum/data/cms/db:DB_CLIENT
DB_DATABASE=dme_spectrum/data/cms/db:DB_DATABASE
DB_HOST=dme_spectrum/data/cms/db:DB_HOST
DB_PORT=dme_spectrum/data/cms/db:DB_PORT
DB_SSL=dme_spectrum/data/cms/db:DB_SSL
```

```js
PORT=dme_spectrum/data/cms/gm
PUBLIC_URL=dme_spectrum/data/cms/gm

DB_CLIENT=dme_spectrum/data/cms/db
DB_DATABASE=dme_spectrum/data/cms/db
DB_HOST=dme_spectrum/data/cms/db
DB_PORT=dme_spectrum/data/cms/db
DB_SSL=dme_spectrum/data/cms/db
```

VaultEnv file should put at the root of the project along with .env and package.json

## Load vault secrets into nodejs process.env

Use it just like dotenv package, as early as possible in your application, require vault-secret-env.

```js
require("vault-secret-env");
```

Run the application with VAULT_ADDR and VAULT_ROOT_TOKEN

```bash
$ VAULT_ADDR=https://localhost:8000 VAULT_ROOT_TOKEN=MTIzNDU node app.js
```

Optionally specify the VAULT_TOKEN_ROLE and VAULT_TOKEN_ROLE_TTL to retrieve the vault secrets by token role and control the token TTL time.

```bash
$ VAULT_ADDR=https://localhost:8000 VAULT_ROOT_TOKEN=MTIzNDU VAULT_TOKEN_ROLE=power_user VAULT_TOKEN_ROLE_TTL=10s node app.js
```

## Command line interface

This package also provides a simple cli to validate the VaultEnv settings.

```bash
$ vault-env -a https://localhost:8000 -t MTIzNDU
```