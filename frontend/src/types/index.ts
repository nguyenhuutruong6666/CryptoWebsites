export interface Coin {
    symbol: string;
    fullSymbol: string;
    price: number;
    change24h: number;
    volume24h: number;
    high24h: number;
    low24h: number;
    marketCap: number;
}

export interface MarketData {
    markets: Coin[];
    timestamp: number;
}

export interface CategoryData {
    popular: Coin[];
    gainers: Coin[];
    volume: Coin[];
    new: Coin[];
}
