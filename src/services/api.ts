import { apiConfig } from '../lib/api/config';

const headers = {
  'x-apisports-key': apiConfig.apiKey,
};

async function fetchFromAPI(endpoint: string) {
  try {
    const res = await fetch(`${apiConfig.baseUrl}${endpoint}`, {
      headers,
    });

    const data = await res.json();

    return data.response ?? [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

// ✅ Get PSL fixtures (South Africa)
export async function getFixtures() {
  return fetchFromAPI(
    `/fixtures?league=288&season=${apiConfig.defaultSeason}`
  );
}

// ✅ Try live first, fallback if no subscription
export async function getLiveMatches() {
  let data = await fetchFromAPI(`/fixtures?live=all`);

  if (!data || data.length === 0) {
    console.log('No live data, falling back...');
    data = await getFixtures();
  }

  return data;
}