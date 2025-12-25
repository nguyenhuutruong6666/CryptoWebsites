'use client';

import { useMemo } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Coin } from '@/types';
import styles from './MarketOverview.module.css';

interface CategoryCardProps {
    title: string;
    coins: Coin[];
    showIcons?: boolean;
}

// Coin icon mapping
const getCoinIcon = (symbol: string) => {
    const icons: { [key: string]: string } = {
        'BNB': '🟡',
        'BTC': '🟠',
        'ETH': '🔵',
        'USDC': '🔵',
        'USDT': '🟢',
        'SOL': '🟣',
        'ADA': '🔵',
        'XRP': '⚪',
    };
    return icons[symbol] || '💰';
};


// Format price with full detail
const formatPrice = (price: number) => {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

function CategoryCard({ title, coins, showIcons = false }: CategoryCardProps) {
    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>{title}</h3>
            <div className={styles.coinList}>
                {coins.slice(0, 3).map((coin) => (
                    <div key={coin.symbol} className={styles.coinItem}>
                        <div className={styles.coinInfo}>
                            {showIcons && (
                                <span className={styles.coinIcon}>{getCoinIcon(coin.symbol)}</span>
                            )}
                            <div className={styles.coinDetails}>
                                <span className={styles.coinSymbol}>{coin.symbol}</span>
                                <span className={styles.coinPrice}>
                                    {showIcons ? formatPrice(coin.price) : `$${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`}
                                </span>
                            </div>
                        </div>
                        <div className={coin.change24h >= 0 ? styles.positive : styles.negative}>
                            {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function MarketOverview() {
    const { markets } = useWebSocket();

    // Phổ biến - hiển thị BNB, BTC, ETH cố định
    const popular = useMemo(() => {
        const targetCoins = ['BNB', 'BTC', 'ETH'];
        const result: Coin[] = [];

        targetCoins.forEach(symbol => {
            const coin = markets.find(c => c.symbol === symbol);
            if (coin) {
                result.push(coin);
            }
        });

        return result;
    }, [markets]);

    const gainers = useMemo(() => {
        return [...markets]
            .filter(coin => coin.change24h > 0)
            .sort((a, b) => b.change24h - a.change24h)
            .slice(0, 10);
    }, [markets]);

    const volume = useMemo(() => {
        return [...markets]
            .sort((a, b) => b.volume24h - a.volume24h)
            .slice(0, 10);
    }, [markets]);

    const newListings = useMemo(() => {
        // Simulate new listings by taking a consistent subset
        const shuffled = [...markets].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 10);
    }, [markets]);

    return (
        <div className={styles.overview}>
            <CategoryCard title="Phổ biến" coins={popular} showIcons={true} />
            <CategoryCard title="Niêm yết mới" coins={newListings} />
            <CategoryCard title="Top tăng giá" coins={gainers} />
            <CategoryCard title="Top khối lượng" coins={volume} />
        </div>
    );
}
