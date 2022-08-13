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
    res.ok ? respond(await res.json()) : respond('Unable to retrieve data from vault.');
  }
  catch (e) {
    respond(e.message);
  }
});

function respond(message) {
  console.log(JSON.stringify(message));
}
