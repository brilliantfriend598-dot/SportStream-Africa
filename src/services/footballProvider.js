const FOOTBALL_DATA_PROVIDERS = {
  MOCK: 'mock',
  LIVE: 'live',
};

function normalizeFootballDataProvider(value) {
  return String(value || '').toLowerCase() === FOOTBALL_DATA_PROVIDERS.LIVE
    ? FOOTBALL_DATA_PROVIDERS.LIVE
    : FOOTBALL_DATA_PROVIDERS.MOCK;
}

function resolveFootballDataSource(provider, hasLiveData) {
  return normalizeFootballDataProvider(provider) === FOOTBALL_DATA_PROVIDERS.LIVE && hasLiveData
    ? 'live'
    : 'sample';
}

module.exports = {
  FOOTBALL_DATA_PROVIDERS,
  normalizeFootballDataProvider,
  resolveFootballDataSource,
};
