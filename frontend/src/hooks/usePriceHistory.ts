'use client';

import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import axios from 'axios';

interface PricePoint {
    timestamp: number;
    price: number;
    time: string;
}

type Timeframe = '1h' | '1d' | '1w' | '1M' | '1Y';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function usePriceHistory(symbol: string, timeframe: Timeframe = '1h') {
    const { markets } = useWebSocket();
    const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const prevPriceRef = useRef<number | null>(null);
    const lastUpdateRef = useRef<number>(0);

    // Fetch historical data when timeframe changes
    useEffect(() => {
        async function fetchHistoricalData() {
            try {
                setIsLoading(true);
                const response = await axios.get(`${API_URL}/api/markets/history/${symbol}`, {
                    params: { timeframe }
                });

                if (response.data.success) {
                    setPriceHistory(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching historical data:', error);
                setPriceHistory([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchHistoricalData();
        prevPriceRef.current = null;
        lastUpdateRef.current = 0;
    }, [symbol, timeframe]);

    // Update with real-time data only for 1h timeframe
    useEffect(() => {
        if (timeframe !== '1h' || isLoading) return;

        const coin = markets.find(m => m.symbol === symbol);
        const now = Date.now();

        if (coin && coin.price !== prevPriceRef.current && now - lastUpdateRef.current >= 1000) {
            const timeStr = new Date(now).toLocaleTimeString('vi-VN', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });

            setPriceHistory(prev => {
                const newPoint: PricePoint = {
                    timestamp: now,
                    price: coin.price,
                    time: timeStr
                };

                const updated = [...prev, newPoint];

                // Keep only last 60 entries for 1h timeframe
                if (updated.length > 60) {
                    return updated.slice(updated.length - 60);
                }

                return updated;
            });

            prevPriceRef.current = coin.price;
            lastUpdateRef.current = now;
        }
    }, [markets, symbol, timeframe, isLoading]);

    return { priceHistory, isLoading };
}
