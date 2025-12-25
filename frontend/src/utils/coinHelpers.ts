// Coin logo URLs from CoinGecko CDN
const logos: { [key: string]: string } = {
    'BTC': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    'ETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    'BNB': 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    'XRP': 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    'ADA': 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    'DOGE': 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
    'SOL': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    'TRX': 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png',
    'DOT': 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
    'MATIC': 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
    'LTC': 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
    'AVAX': 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
    'LINK': 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
    'UNI': 'https://assets.coingecko.com/coins/images/12504/small/uni.jpg',
    'ATOM': 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png',
    'XLM': 'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png',
    'NEAR': 'https://assets.coingecko.com/coins/images/10365/small/near.jpg',
    'ALGO': 'https://assets.coingecko.com/coins/images/4380/small/download.png',
    'VET': 'https://assets.coingecko.com/coins/images/1167/small/VeChain-Logo-768x725.png',
    'FIL': 'https://assets.coingecko.com/coins/images/12817/small/filecoin.png',
    'USDT': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    'USDC': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
    'BUSD': 'https://assets.coingecko.com/coins/images/9576/small/BUSD.png',
};

// Coin colors
const colors: { [key: string]: string } = {
    'BTC': '#F7931A',
    'ETH': '#627EEA',
    'BNB': '#F3BA2F',
    'XRP': '#23292F',
    'ADA': '#0033AD',
    'DOGE': '#C2A633',
    'SOL': '#14F195',
    'TRX': '#EB0029',
    'DOT': '#E6007A',
    'MATIC': '#8247E5',
    'LTC': '#345D9D',
    'AVAX': '#E84142',
    'LINK': '#2A5ADA',
    'UNI': '#FF007A',
    'ATOM': '#2E3148',
    'XLM': '#000000',
    'NEAR': '#000000',
    'ALGO': '#000000',
    'VET': '#15BDFF',
    'FIL': '#0090FF',
    'USDT': '#26A17B',
    'USDC': '#2775CA',
    'BUSD': '#F0B90B',
};

// Coin full names
const names: { [key: string]: string } = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'BNB': 'BNB',
    'XRP': 'XRP',
    'ADA': 'Cardano',
    'DOGE': 'Dogecoin',
    'SOL': 'Solana',
    'TRX': 'TRON',
    'DOT': 'Polkadot',
    'MATIC': 'Polygon',
    'LTC': 'Litecoin',
    'AVAX': 'Avalanche',
    'LINK': 'Chainlink',
    'UNI': 'Uniswap',
    'ATOM': 'Cosmos',
    'XLM': 'Stellar',
    'NEAR': 'NEAR Protocol',
    'ALGO': 'Algorand',
    'VET': 'VeChain',
    'FIL': 'Filecoin',
    'USDT': 'Tether',
    'USDC': 'USD Coin',
    'BUSD': 'Binance USD',
};

export function getCoinLogo(symbol: string): string {
    return logos[symbol] || 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png';
}

export function getCoinColor(symbol: string): string {
    return colors[symbol] || '#F7931A';
}

export function getCoinName(symbol: string): string {
    return names[symbol] || symbol;
}
