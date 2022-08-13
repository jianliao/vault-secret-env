#!/usr/bin/env node

const chunks = [];

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
  chunks.push(chunk);
});

process.stdin.on('end', async () => {
  const { url, headers, method, body } = JSON.parse(chunks.join(''));

  try {
    const res = await fetch(url, { headers, method, body });
    res.ok ? handleData(await res.json()) : handleError(`Unable to retrieve data from vault. Reason: ${res.statusText}`);
  }
  catch (e) {
    handleError(e.message);
  }
});

function handleData(data) {
  console.log(JSON.stringify(data));
}

function handleError(error) {
  console.log(JSON.stringify({ error }));
}
