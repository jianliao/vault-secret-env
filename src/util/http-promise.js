const http = require('http');
const https = require('https');
const { URL } = require('url');
const { TextEncoder, TextDecoder } = require('util');

exports.request = async (urlString, headers = {}, method = 'GET', bodyData = null) => {
  const url = new URL(urlString);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`Unsupported protocol ${url.protocol} found`);
  }

  if (bodyData) {
    bodyData = new TextEncoder().encode(bodyData);
    headers['Content-Length'] = bodyData.length;
  }

  const options = {
    method,
    host: url.hostname,
    port: url.port || (url.protocol === 'http:' ? 80 : 443),
    path: url.pathname || '/',
    headers
  }

  const protocol = url.protocol === 'http:' ? http : https;

  return new Promise((resolve, reject) => {
    const req = protocol.request(options, (res) => {

      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject({ 'statusCode': res.statusCode });
      }

      const data = [];

      res.on("data", chunk => {
        data.push(chunk);
      });

      res.on("end", () => {
        try {
          const jsonRes = JSON.parse(new TextDecoder().decode(Buffer.concat(data)));
          resolve(jsonRes);
        } catch (e) {
          try {
            resolve(new TextDecoder().decode(Buffer.concat(data)));
          } catch (e) {
            reject(e);
          }
        }
      });
    });

    req.on("error", reject);

    if (bodyData) {
      req.write(bodyData);
    }

    req.end();
  });
}
