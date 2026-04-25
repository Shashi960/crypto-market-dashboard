export const fetchCoins = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  return response.json();
};

export const fetchGlobalStats = async () => {
  const response = await fetch("https://api.coingecko.com/api/v3/global");
  if (!response.ok) {
    throw new Error("Failed to fetch global stats");
  }
  return response.json();
};