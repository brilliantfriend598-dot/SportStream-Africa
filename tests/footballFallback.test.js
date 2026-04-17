const assert = require('node:assert/strict');

const {
  resolveFallbackNotice,
  resolveListFetchState,
  resolveNotFoundState,
} = require('../src/services/footballFallback');

let state = resolveListFetchState('live', true, 'empty', 'fallback');
assert.equal(state.source, 'live');
assert.equal(state.notice, null);

state = resolveListFetchState('mock', true, 'empty', 'fallback');
assert.equal(state.source, 'sample');
assert.equal(state.notice, null);

state = resolveListFetchState('live', false, 'empty', 'fallback');
assert.equal(state.source, 'sample');
assert.equal(state.notice, 'empty');

state = resolveListFetchState('mock', false, 'empty', 'fallback');
assert.equal(state.source, 'sample');
assert.equal(state.notice, null);

assert.equal(resolveFallbackNotice('live', 'fallback'), 'fallback');
assert.equal(resolveFallbackNotice('mock', 'fallback'), null);

const notFoundLive = resolveNotFoundState('live');
assert.equal(notFoundLive.error, 'Match not found');
assert.equal(notFoundLive.source, 'live');

const notFoundMock = resolveNotFoundState('mock');
assert.equal(notFoundMock.error, 'Match not found');
assert.equal(notFoundMock.source, 'sample');

console.log('football fallback tests passed');
