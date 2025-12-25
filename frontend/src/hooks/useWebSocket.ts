'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Coin, MarketData } from '@/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export function useWebSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [markets, setMarkets] = useState<Coin[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<number>(0);

    useEffect(() => {
        // Khởi tạo Socket.io connection
        const socketInstance = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketInstance.on('connect', () => {
            console.log('✅ WebSocket connected');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('❌ WebSocket disconnected');
            setIsConnected(false);
        });

        // Nhận dữ liệu ban đầu
        socketInstance.on('initialData', (data: MarketData) => {
            console.log('📊 Initial data received:', data.markets.length, 'coins');
            setMarkets(data.markets);
            setLastUpdate(data.timestamp);
        });

        // Nhận updates theo thời gian thực
        socketInstance.on('priceUpdate', (data: MarketData) => {
            setMarkets(data.markets);
            setLastUpdate(data.timestamp);
        });

        socketInstance.on('error', (error: Error) => {
            console.error('WebSocket error:', error);
        });

        setSocket(socketInstance);

        // Cleanup khi component unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return {
        socket,
        markets,
        isConnected,
        lastUpdate
    };
}
