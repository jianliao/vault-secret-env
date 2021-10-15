exports.parseVaultEnv = (vaultSecrets) => {
  const secretsByPath = {};
  for (const varName in vaultSecrets) {
    const varValue = vaultSecrets[varName];
    const secretPath = varValue.split(':')[0];
    const secretKey = varValue.split(':')[1] || varName;
    if (!secretsByPath[secretPath]) {
      secretsByPath[secretPath] = {};
    }
    secretsByPath[secretPath][secretKey] = '';
  }
  return secretsByPath;
}
