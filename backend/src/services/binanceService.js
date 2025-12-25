const axios = require('axios');

const BINANCE_API_URL = process.env.BINANCE_API_URL || 'https://api.binance.com/api/v3';

// Cache để giảm API calls
let cache = {
  allMarkets: null,
  lastUpdate: null,
  cacheTime: 5000 // 5 seconds
};

// Mapping timeframe to Binance kline intervals
const TIMEFRAME_TO_INTERVAL = {
  '1h': '1m',   // 1 hour: 1-minute candles
  '1d': '5m',   // 1 day: 5-minute candles
  '1w': '1h',   // 1 week: 1-hour candles
  '1M': '4h',   // 1 month: 4-hour candles
  '1Y': '1d'    // 1 year: 1-day candles
};

const TIMEFRAME_TO_LIMIT = {
  '1h': 60,     // 60 minutes
  '1d': 288,    // 24h * 12 (5-min intervals)
  '1w': 168,    // 7 days * 24 hours
  '1M': 180,    // 30 days * 6 (4-hour intervals)
  '1Y': 365     // 365 days
};

/**
 * Fetch tất cả trading pairs từ Binance
 */
async function getAllMarkets() {
  try {
    // Check cache
    const now = Date.now();
    if (cache.allMarkets && cache.lastUpdate && (now - cache.lastUpdate < cache.cacheTime)) {
      return cache.allMarkets;
    }

    // Fetch 24hr ticker data cho tất cả symbols
    const response = await axios.get(`${BINANCE_API_URL}/ticker/24hr`);

    // Filter chỉ lấy USDT pairs và format data
    const usdtPairs = response.data
      .filter(ticker => ticker.symbol.endsWith('USDT'))
      .map(ticker => ({
        symbol: ticker.symbol.replace('USDT', ''),
        fullSymbol: ticker.symbol,
        price: parseFloat(ticker.lastPrice),
        change24h: parseFloat(ticker.priceChangePercent),
        volume24h: parseFloat(ticker.quoteVolume),
        high24h: parseFloat(ticker.highPrice),
        low24h: parseFloat(ticker.lowPrice),
        marketCap: parseFloat(ticker.quoteVolume) * 10 // Approximate market cap
      }))
      .filter(coin => coin.price > 0)
      .sort((a, b) => b.volume24h - a.volume24h) // Sort by volume
      .slice(0, 100); // Top 100 coins

    // Update cache
    cache.allMarkets = usdtPairs;
    cache.lastUpdate = now;

    return usdtPairs;
  } catch (error) {
    console.error('Error fetching markets from Binance:', error.message);
    // Return cached data if available
    return cache.allMarkets || [];
  }
}

/**
 * Lấy popular coins (top volume)
 */
async function getPopularCoins() {
  const markets = await getAllMarkets();
  return markets.slice(0, 10);
}

/**
 * Lấy top gainers (% tăng cao nhất)
 */
async function getTopGainers() {
  const markets = await getAllMarkets();
  return markets
    .filter(coin => coin.change24h > 0)
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 10);
}

/**
 * Lấy top volume
 */
async function getTopVolume() {
  const markets = await getAllMarkets();
  return markets.slice(0, 10);
}

/**
 * Lấy new listings (giả lập - random 10 coins)
 */
async function getNewListings() {
  const markets = await getAllMarkets();
  // Simulate new listings by taking random coins
  const shuffled = [...markets].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
}

/**
 * Cập nhật giá real-time cho một symbol cụ thể
 */
async function getCurrentPrice(symbol) {
  try {
    const fullSymbol = symbol.endsWith('USDT') ? symbol : `${symbol}USDT`;
    const response = await axios.get(`${BINANCE_API_URL}/ticker/price?symbol=${fullSymbol}`);
    return parseFloat(response.data.price);
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Lấy historical price data từ Binance
 */
async function getHistoricalPrices(symbol, timeframe = '1h') {
  try {
    const interval = TIMEFRAME_TO_INTERVAL[timeframe] || '1m';
    const limit = TIMEFRAME_TO_LIMIT[timeframe] || 60;

    const response = await axios.get(`${BINANCE_API_URL}/klines`, {
      params: {
        symbol: `${symbol}USDT`,
        interval: interval,
        limit: limit
      }
    });

    // Transform Binance kline data to our format
    const historicalData = response.data.map(kline => {
      const timestamp = kline[0];
      const closePrice = parseFloat(kline[4]);

      return {
        timestamp,
        price: closePrice,
        time: formatTime(timestamp, timeframe)
      };
    });

    return historicalData;
  } catch (error) {
    console.error(`Error fetching historical prices for ${symbol}:`, error.message);
    throw error;
  }
}

function formatTime(timestamp, timeframe) {
  const date = new Date(timestamp);

  switch (timeframe) {
    case '1h':
      return date.toLocaleTimeString('vi-VN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    case '1d':
      return date.toLocaleTimeString('vi-VN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    case '1w':
      return date.toLocaleDateString('vi-VN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit'
      });
    case '1M':
      return date.toLocaleDateString('vi-VN', {
        month: 'short',
        day: 'numeric'
      });
    case '1Y':
      return date.toLocaleDateString('vi-VN', {
        month: 'short',
        year: 'numeric'
      });
    default:
      return date.toLocaleTimeString('vi-VN');
  }
}

module.exports = {
  getAllMarkets,
  getPopularCoins,
  getTopGainers,
  getTopVolume,
  getNewListings,
  getCurrentPrice,
  getHistoricalPrices
};
