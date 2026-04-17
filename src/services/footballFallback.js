const { normalizeFootballDataProvider } = require('./footballProvider');

function resolveListFetchState(provider, hasLiveData, emptyMessage, fallbackNotice) {
  const normalizedProvider = normalizeFootballDataProvider(provider);

  if (hasLiveData) {
    return {
      notice: null,
      source: normalizedProvider === 'live' ? 'live' : 'sample',
    };
  }

  return {
    notice: normalizedProvider === 'live' ? emptyMessage || fallbackNotice || null : null,
    source: 'sample',
  };
}

function resolveFallbackNotice(provider, fallbackNotice) {
  return normalizeFootballDataProvider(provider) === 'live' ? fallbackNotice : null;
}

function resolveNotFoundState(provider) {
  return {
    error: 'Match not found',
    source: normalizeFootballDataProvider(provider) === 'live' ? 'live' : 'sample',
  };
}

module.exports = {
  resolveFallbackNotice,
  resolveListFetchState,
  resolveNotFoundState,
};
