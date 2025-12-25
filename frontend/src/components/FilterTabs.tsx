'use client';

import { useState } from 'react';
import styles from './FilterTabs.module.css';

export default function FilterTabs() {
    const [activeMainTab, setActiveMainTab] = useState('crypto');
    const [activeFilter, setActiveFilter] = useState('all');

    const mainTabs = [
        { id: 'favorites', label: 'Danh sách yêu thích' },
        { id: 'crypto', label: 'Tiền mã hóa' },
        { id: 'spot', label: 'Giao ngay' },
        { id: 'futures', label: 'Hợp đồng tương lai' },
    ];

    const filters = [
        { id: 'all', label: 'Tất cả' },
        { id: 'bnb', label: 'BNB Chain' },
        { id: 'sol', label: 'Solana' },
        { id: 'rwa', label: 'RWA' },
        { id: 'meme', label: 'Meme' },
        { id: 'ai', label: 'AI' },
        { id: 'layer1', label: 'Layer 1' },
        { id: 'layer2', label: 'Layer 2' },
    ];

    return (
        <div className={styles.filterContainer}>
            {/* Main Tabs */}
            <div className={styles.mainTabs}>
                {mainTabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles.mainTab} ${activeMainTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveMainTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Filter Tags */}
            <div className={styles.filterTags}>
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        className={`${styles.filterTag} ${activeFilter === filter.id ? styles.active : ''}`}
                        onClick={() => setActiveFilter(filter.id)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
