'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Coin } from '@/types';
import { getCoinLogo, getCoinColor, getCoinName } from '@/utils/coinHelpers';
import styles from './CoinTable.module.css';

export default function CoinTable() {
    const { markets, isConnected } = useWebSocket();
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'change' | 'volume' | 'marketCap'>('volume');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [flashingCells, setFlashingCells] = useState<Set<string>>(new Set());
    const prevPricesRef = useRef<Map<string, number>>(new Map());

    // Sort markets with priority for top coins
    const sortedMarkets = [...markets].sort((a, b) => {
        const priorityCoins = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'USDC', 'SOL'];
        const aPriority = priorityCoins.indexOf(a.symbol);
        const bPriority = priorityCoins.indexOf(b.symbol);

        if (aPriority !== -1 && bPriority !== -1) {
            return aPriority - bPriority;
        }

        if (aPriority !== -1) return -1;
        if (bPriority !== -1) return 1;

        let aValue, bValue;

        switch (sortBy) {
            case 'name':
                return sortOrder === 'asc'
                    ? a.symbol.localeCompare(b.symbol)
                    : b.symbol.localeCompare(a.symbol);
            case 'price':
                aValue = a.price;
                bValue = b.price;
                break;
            case 'change':
                aValue = a.change24h;
                bValue = b.change24h;
                break;
            case 'volume':
                aValue = a.volume24h;
                bValue = b.volume24h;
                break;
            case 'marketCap':
                aValue = a.marketCap;
                bValue = b.marketCap;
                break;
            default:
                return 0;
        }

        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    const handleSort = (column: typeof sortBy) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    useEffect(() => {
        const newFlashingCells = new Set<string>();

        markets.forEach((coin) => {
            const prevPrice = prevPricesRef.current.get(coin.symbol);
            if (prevPrice !== undefined && prevPrice !== coin.price) {
                const direction = coin.price > prevPrice ? 'up' : 'down';
                newFlashingCells.add(`${coin.symbol}-${direction}`);
            }
            prevPricesRef.current.set(coin.symbol, coin.price);
        });

        if (newFlashingCells.size > 0) {
            setFlashingCells(newFlashingCells);
            setTimeout(() => setFlashingCells(new Set()), 500);
        }
    }, [markets]);

    const formatNumber = (num: number, decimals: number = 2) => {
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
        return `$${num.toFixed(decimals)}`;
    };

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <h2 className={styles.title}>Thị trường Crypto</h2>
                <div className={styles.connectionStatus}>
                    <span className={isConnected ? styles.connected : styles.disconnected}>
                        {isConnected ? '● Live' : '○ Disconnected'}
                    </span>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('name')} className={styles.sortable}>
                                Tên
                                {sortBy === 'name' && <span className={styles.sortIcon}>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                            </th>
                            <th onClick={() => handleSort('price')} className={styles.sortable}>
                                Giá
                                {sortBy === 'price' && <span className={styles.sortIcon}>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                            </th>
                            <th onClick={() => handleSort('change')} className={styles.sortable}>
                                24h Thay đổi
                                {sortBy === 'change' && <span className={styles.sortIcon}>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                            </th>
                            <th onClick={() => handleSort('volume')} className={styles.sortable}>
                                KL 24h
                                {sortBy === 'volume' && <span className={styles.sortIcon}>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                            </th>
                            <th onClick={() => handleSort('marketCap')} className={styles.sortable}>
                                Vốn hóa thị trường
                                {sortBy === 'marketCap' && <span className={styles.sortIcon}>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMarkets.slice(0, 50).map((coin) => {
                            const priceFlashing = flashingCells.has(`${coin.symbol}-up`) ? styles.flashGreen :
                                flashingCells.has(`${coin.symbol}-down`) ? styles.flashRed : '';

                            return (
                                <tr key={coin.symbol} className={styles.row}>
                                    <td className={styles.nameCell}>
                                        <Link href={`/coin/${coin.symbol.toLowerCase()}`} className={styles.coinLink}>
                                            <div className={styles.coinInfo}>
                                                <div
                                                    className={styles.coinIcon}
                                                    style={{ backgroundColor: getCoinColor(coin.symbol) }}
                                                >
                                                    <img
                                                        src={getCoinLogo(coin.symbol)}
                                                        alt={coin.symbol}
                                                        className={styles.coinLogoImg}
                                                    />
                                                </div>
                                                <div className={styles.coinName}>
                                                    <span className={styles.coinSymbol}>{coin.symbol}</span>
                                                    <span className={styles.coinFullName}>{getCoinName(coin.symbol)}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className={`${styles.priceCell} ${priceFlashing}`}>
                                        <div className={styles.priceWrapper}>
                                            <div className={styles.mainPrice}>
                                                ${coin.price.toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: coin.price < 1 ? 8 : 2
                                                })}
                                            </div>
                                            <div className={styles.subPrice}>
                                                ${coin.price.toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </div>
                                        </div>
                                    </td>
                                    <td className={coin.change24h >= 0 ? styles.positive : styles.negative}>
                                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                                    </td>
                                    <td>{formatNumber(coin.volume24h)}</td>
                                    <td>{formatNumber(coin.marketCap)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {markets.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>Đang tải dữ liệu cryptocurrency...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
