#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const { URL } = require('url');

loadEnvFile(path.join(__dirname, '.env'));

const upstreamBase = process.env.FOOTBALL_API_BASE_URL || process.env.EXPO_PUBLIC_FOOTBALL_API_BASE_URL;
const apiKey = process.env.FOOTBALL_API_KEY || process.env.EXPO_PUBLIC_FOOTBALL_API_KEY;
const host = process.env.PROXY_HOST || '0.0.0.0';
const port = Number(process.env.PROXY_PORT || 8787);

if (!upstreamBase) {
  console.error('Missing FOOTBALL_API_BASE_URL or EXPO_PUBLIC_FOOTBALL_API_BASE_URL');
  process.exit(1);
}

if (!apiKey) {
  console.error('Missing FOOTBALL_API_KEY');
  process.exit(1);
}

const upstreamUrl = new URL(upstreamBase);
const allowedPrefixes = ['/fixtures', '/fixtures/statistics', '/fixtures/events', '/standings'];

const server = http.createServer((req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'GET' || !req.url) {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (!allowedPrefixes.some((prefix) => requestUrl.pathname.startsWith(prefix))) {
    sendJson(res, 404, { error: 'Unsupported endpoint' });
    return;
  }

  const targetUrl = new URL(requestUrl.pathname + requestUrl.search, upstreamUrl);
  const transport = targetUrl.protocol === 'https:' ? https : http;

  const proxyRequest = transport.request(
    targetUrl,
    {
      method: 'GET',
      headers: {
        'x-apisports-key': apiKey,
        Accept: 'application/json',
      },
    },
    (proxyResponse) => {
      const chunks = [];

      proxyResponse.on('data', (chunk) => chunks.push(chunk));
      proxyResponse.on('end', () => {
        const body = Buffer.concat(chunks);
        const contentType = proxyResponse.headers['content-type'] || 'application/json';
        res.writeHead(proxyResponse.statusCode || 502, { 'Content-Type': contentType });
        res.end(body);
      });
    },
  );

  proxyRequest.on('error', (error) => {
    sendJson(res, 502, { error: 'Proxy request failed', detail: error.message });
  });

  proxyRequest.end();
});

server.listen(port, host, () => {
  console.log(`SportStream proxy listening on http://${host}:${port}`);
});

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const raw = fs.readFileSync(filePath, 'utf8');

  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}
