'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWebSocket } from '@/hooks/useWebSocket';
import { usePriceHistory } from '@/hooks/usePriceHistory';
import PriceChart from '@/components/PriceChart';
import CoinStats from '@/components/CoinStats';
import styles from './page.module.css';

type Timeframe = '1h' | '1d' | '1w' | '1M' | '1Y';

export default function CoinDetailPage() {
    const params = useParams();
    const router = useRouter();
    const symbol = params.symbol as string;
    const [timeframe, setTimeframe] = useState<Timeframe>('1h');

    const { markets, isConnected } = useWebSocket();
    const { priceHistory, isLoading } = usePriceHistory(symbol.toUpperCase(), timeframe);

    const coin = markets.find(m => m.symbol === symbol.toUpperCase());

    if (!coin && markets.length > 0) {
        return (
            <div className={styles.container}>
                <div className={styles.notFound}>
                    <h1>Coin không tìm thấy</h1>
                    <p>Symbol "{symbol}" không tồn tại trong danh sách.</p>
                    <button onClick={() => router.push('/')} className={styles.backButton}>
                        ← Quay lại trang chủ
                    </button>
                </div>
            </div>
        );
    }

    if (!coin) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <p>Đang tải dữ liệu coin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <button onClick={() => router.push('/')} className={styles.backButton}>
                    ← Quay lại
                </button>
                <div className={styles.coinHeader}>
                    <div className={styles.coinInfo}>
                        <h1 className={styles.coinSymbol}>{coin.symbol}</h1>
                        <span className={styles.coinFullName}>{coin.fullSymbol}</span>
                    </div>
                    <div className={styles.priceInfo}>
                        <span className={styles.currentPrice}>
                            ${coin.price.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: coin.price < 1 ? 8 : 2
                            })}
                        </span>
                        <span className={coin.change24h >= 0 ? styles.positive : styles.negative}>
                            {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                        </span>
                    </div>
                    <div className={styles.liveStatus}>
                        <span className={isConnected ? styles.connected : styles.disconnected}>
                            {isConnected ? '● Live' : '○ Disconnected'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <PriceChart
                data={priceHistory}
                symbol={coin.symbol}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                isLoading={isLoading}
            />

            {/* Stats */}
            <CoinStats coin={coin} />
        </div>
    );
}
