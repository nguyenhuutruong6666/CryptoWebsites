'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './PriceChart.module.css';

interface PricePoint {
    timestamp: number;
    price: number;
    time: string;
}

type Timeframe = '1h' | '1d' | '1w' | '1M' | '1Y';

interface PriceChartProps {
    data: PricePoint[];
    symbol: string;
    timeframe: Timeframe;
    onTimeframeChange: (timeframe: Timeframe) => void;
    isLoading?: boolean;
}

export default function PriceChart({ data, symbol, timeframe, onTimeframeChange, isLoading = false }: PriceChartProps) {
    const timeframes: { value: Timeframe; label: string }[] = [
        { value: '1h', label: '1 Giờ' },
        { value: '1d', label: 'Ngày' },
        { value: '1w', label: 'Tuần' },
        { value: '1M', label: 'Tháng' },
        { value: '1Y', label: 'Năm' }
    ];

    if (isLoading || data.length === 0) {
        return (
            <div className={styles.chartContainer}>
                <div className={styles.chartHeader}>
                    <div className={styles.headerLeft}>
                        <h3 className={styles.chartTitle}>Biểu đồ giá {symbol} - Real-time</h3>
                        <span className={styles.updateInfo}>Đang thu thập dữ liệu...</span>
                    </div>
                    <div className={styles.timeframeButtons}>
                        {timeframes.map((tf) => (
                            <button
                                key={tf.value}
                                className={`${styles.timeframeBtn} ${timeframe === tf.value ? styles.active : ''}`}
                                onClick={() => onTimeframeChange(tf.value)}
                            >
                                {tf.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.loading}>
                    <p>Đang tải dữ liệu biểu đồ...</p>
                </div>
            </div>
        );
    }

    const minPrice = Math.min(...data.map(d => d.price));
    const maxPrice = Math.max(...data.map(d => d.price));
    const priceRange = maxPrice - minPrice;
    const yAxisDomain: [number, number] = [
        Number((minPrice - priceRange * 0.1).toFixed(2)),
        Number((maxPrice + priceRange * 0.1).toFixed(2))
    ];

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
                <div className={styles.headerLeft}>
                    <h3 className={styles.chartTitle}>Biểu đồ giá {symbol} - Real-time</h3>
                    <span className={styles.updateInfo}>Cập nhật tự động</span>
                </div>
                <div className={styles.timeframeButtons}>
                    {timeframes.map((tf) => (
                        <button
                            key={tf.value}
                            className={`${styles.timeframeBtn} ${timeframe === tf.value ? styles.active : ''}`}
                            onClick={() => onTimeframeChange(tf.value)}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F0B90B" stopOpacity={0.8} />
                            <stop offset="50%" stopColor="#F0B90B" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#F0B90B" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2B3139" vertical={false} />
                    <XAxis
                        dataKey="time"
                        stroke="#848E9C"
                        tick={{ fill: '#848E9C', fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: '#2B3139' }}
                    />
                    <YAxis
                        stroke="#848E9C"
                        tick={{ fill: '#848E9C', fontSize: 11 }}
                        domain={yAxisDomain}
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                        tickLine={false}
                        axisLine={{ stroke: '#2B3139' }}
                        orientation="right"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1E2329',
                            border: '1px solid #2B3139',
                            borderRadius: '4px',
                            color: '#EAECEF'
                        }}
                        formatter={(value: number) => [`$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Giá']}
                        labelFormatter={(label) => `Thời gian: ${label}`}
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#F0B90B"
                        strokeWidth={2}
                        fill="url(#colorPrice)"
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
