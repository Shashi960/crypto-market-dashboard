export const getCurrencySymbol = (currency = "USD") => {
  switch (currency?.toUpperCase()) {
    case "INR": return "₹";
    case "EUR": return "€";
    case "GBP": return "£";
    case "JPY": return "¥";
    default: return "$";
  }
};

export const formatMarketCap = (n, currency = "USD") => {
  if (!Number.isFinite(n)) return "N/A";
  const sym = getCurrencySymbol(currency);
  if (n >= 1e12) return `${sym}${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${sym}${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${sym}${(n / 1e6).toFixed(2)}M`;
  return `${sym}${n.toLocaleString()}`;
};
