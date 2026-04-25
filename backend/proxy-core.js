const fs = require('fs');
const http = require('http');
const https = require('https');
const os = require('os');
const path = require('path');
const { URL } = require('url');

const allowedPrefixes = ['/fixtures', '/fixtures/statistics', '/fixtures/events', '/standings'];

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

function normalizeBaseUrl(url) {
  return url.replace(/\/+$/, '');
}

function getProxyConfig() {
  const upstreamBase = normalizeBaseUrl(
    process.env.FOOTBALL_API_BASE_URL || process.env.EXPO_PUBLIC_FOOTBALL_API_BASE_URL || '',
  );
  const apiKey = process.env.FOOTBALL_API_KEY || process.env.EXPO_PUBLIC_FOOTBALL_API_KEY;

  if (!upstreamBase) {
    throw new Error('Missing FOOTBALL_API_BASE_URL or EXPO_PUBLIC_FOOTBALL_API_BASE_URL');
  }

  if (!apiKey) {
    throw new Error('Missing FOOTBALL_API_KEY');
  }

  return {
    upstreamUrl: new URL(upstreamBase),
    apiKey,
  };
}

function getSuggestedProxyUrls(port) {
  const urls = [`http://localhost:${port}`];
  const interfaces = os.networkInterfaces();

  Object.values(interfaces).forEach((entries) => {
    (entries || []).forEach((entry) => {
      if (entry && entry.family === 'IPv4' && !entry.internal) {
        urls.push(`http://${entry.address}:${port}`);
      }
    });
  });

  return Array.from(new Set(urls));
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

function handleProxyRequest(req, res, options = {}) {
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

  let config;

  try {
    config = getProxyConfig();
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : 'Invalid proxy configuration' });
    return;
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  requestUrl.searchParams.delete('path');

  if (requestUrl.pathname === '/health') {
    sendJson(res, 200, {
      ok: true,
      upstream: config.upstreamUrl.origin,
      mode: options.mode ?? 'unknown',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (!allowedPrefixes.some((prefix) => requestUrl.pathname.startsWith(prefix))) {
    sendJson(res, 404, { error: 'Unsupported endpoint' });
    return;
  }

  const forwardedSearch = new URLSearchParams(requestUrl.searchParams);
  forwardedSearch.delete('path');

  const targetUrl = new URL(requestUrl.pathname, config.upstreamUrl);
  const nextSearch = forwardedSearch.toString();
  targetUrl.search = nextSearch ? `?${nextSearch}` : '';
  const transport = targetUrl.protocol === 'https:' ? https : http;

  const proxyRequest = transport.request(
    targetUrl,
    {
      method: 'GET',
      headers: {
        'x-apisports-key': config.apiKey,
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
}

function createLocalServer() {
  loadEnvFile(path.join(process.cwd(), '.env'));

  const host = process.env.PROXY_HOST || '0.0.0.0';
  const port = Number(process.env.PROXY_PORT || 8787);
  const server = http.createServer((req, res) => handleProxyRequest(req, res, { mode: 'local' }));

  server.listen(port, host, () => {
    const suggestedUrls = getSuggestedProxyUrls(port);

    console.log(`SportStream proxy listening on http://${host}:${port}`);
    console.log('');
    console.log('Use one of these in EXPO_PUBLIC_API_PROXY_URL for phone testing:');
    suggestedUrls.forEach((url) => console.log(`- ${url}`));
    console.log('');
    console.log('Health check:');
    suggestedUrls.forEach((url) => console.log(`- ${url}/health`));
  });

  return server;
}

module.exports = {
  createLocalServer,
  handleProxyRequest,
  loadEnvFile,
};
