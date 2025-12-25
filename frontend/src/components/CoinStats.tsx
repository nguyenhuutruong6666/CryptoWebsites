'use client';

import { Coin } from '@/types';
import styles from './CoinStats.module.css';

interface CoinStatsProps {
    coin: Coin;
}

export default function CoinStats({ coin }: CoinStatsProps) {
    const formatNumber = (num: number, decimals: number = 2) => {
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
        return `$${num.toFixed(decimals)}`;
    };

    const stats = [
        {
            label: '24h High',
            value: `$${coin.high24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            color: 'var(--green-positive)'
        },
        {
            label: '24h Low',
            value: `$${coin.low24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            color: 'var(--red-negative)'
        },
        {
            label: '24h Volume',
            value: formatNumber(coin.volume24h),
            color: 'var(--text-primary)'
        },
        {
            label: 'Market Cap',
            value: formatNumber(coin.marketCap),
            color: 'var(--text-primary)'
        },
        {
            label: '24h Change',
            value: `${coin.change24h >= 0 ? '+' : ''}${coin.change24h.toFixed(2)}%`,
            color: coin.change24h >= 0 ? 'var(--green-positive)' : 'var(--red-negative)'
        },
        {
            label: 'Price',
            value: `$${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            color: 'var(--binance-yellow)'
        }
    ];

    return (
        <div className={styles.statsContainer}>
            <h3 className={styles.statsTitle}>Thông tin chi tiết</h3>
            <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <div key={index} className={styles.statCard}>
                        <span className={styles.statLabel}>{stat.label}</span>
                        <span className={styles.statValue} style={{ color: stat.color }}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
