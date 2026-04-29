const getOptions = () => {
  const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
  return apiKey ? {
    headers: {
      'x-cg-demo-api-key': apiKey
    }
  } : undefined;
};

export const fetchCoins = async (currency = 'usd') => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.toLowerCase()}&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h,24h,7d`,
    getOptions()
  );

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  return response.json();
};

export const fetchGlobalStats = async () => {
  const response = await fetch("https://api.coingecko.com/api/v3/global", getOptions());
  if (!response.ok) {
    throw new Error("Failed to fetch global stats");
  }
  return response.json();
};

export const fetchTrendingMarketData = async (currency = 'usd') => {
  // 1. Get trending IDs
  const trendingResponse = await fetch("https://api.coingecko.com/api/v3/search/trending", getOptions());
  if (!trendingResponse.ok) throw new Error("Failed to fetch trending");
  const trendingData = await trendingResponse.json();
  
  if (!trendingData.coins || trendingData.coins.length === 0) return [];
  
  const idArray = trendingData.coins.map(c => c.item.id);
  const ids = idArray.join(',');

  // 2. Fetch market data for these IDs
  const marketResponse = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.toLowerCase()}&ids=${ids}&sparkline=true&price_change_percentage=1h,24h,7d`,
    getOptions()
  );
  if (!marketResponse.ok) throw new Error("Failed to fetch trending market data");
  
  const marketData = await marketResponse.json();
  
  // 3. Sort marketData to match the original trending rank from CoinGecko
  return idArray.map(id => marketData.find(coin => coin.id === id)).filter(Boolean);
};

export const fetchCoinChart = async (id, days, currency = 'usd') => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency.toLowerCase()}&days=${days}`,
    getOptions()
  );
  if (!response.ok) {
    throw new Error("Failed to fetch chart data");
  }
  return response.json();
};
