const assert = require('node:assert/strict');

const {
  FOOTBALL_DATA_PROVIDERS,
  normalizeFootballDataProvider,
  resolveFootballDataSource,
} = require('../src/services/footballProvider');

assert.equal(normalizeFootballDataProvider(undefined), FOOTBALL_DATA_PROVIDERS.MOCK);
assert.equal(normalizeFootballDataProvider(''), FOOTBALL_DATA_PROVIDERS.MOCK);
assert.equal(normalizeFootballDataProvider('anything-else'), FOOTBALL_DATA_PROVIDERS.MOCK);

assert.equal(normalizeFootballDataProvider('live'), FOOTBALL_DATA_PROVIDERS.LIVE);
assert.equal(normalizeFootballDataProvider('LIVE'), FOOTBALL_DATA_PROVIDERS.LIVE);

assert.equal(resolveFootballDataSource('live', true), 'live');
assert.equal(resolveFootballDataSource('live', false), 'sample');
assert.equal(resolveFootballDataSource('mock', true), 'sample');
assert.equal(resolveFootballDataSource('mock', false), 'sample');

console.log('football provider tests passed');
