#!/usr/bin/env node

const { request } = require('./util/http-promise');

const chunks = [];

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
  chunks.push(chunk);
});

process.stdin.on('end', async () => {
  const { url, headers, method, body } = JSON.parse(chunks.join(''));

  try {
    const result = await request(url, headers, method, body);
    respond(result);
  }
  catch (e) {
    respond(e.message);
  }
});

function respond(message) {
  console.log(JSON.stringify(message));
}
