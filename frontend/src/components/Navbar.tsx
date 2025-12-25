'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Logo */}
                <div className={styles.logo}>
                    <span className={styles.logoText}>TCrypto</span>
                </div>

                {/* Main Navigation */}
                <div className={styles.navLinks}>
                    <Link href="#" className={styles.navLink}>Mua Crypto</Link>
                    <Link href="#" className={`${styles.navLink} ${styles.active}`}>Thị trường</Link>
                    <Link href="#" className={styles.navLink}>Giao dịch</Link>
                </div>

                {/* Right Section */}
                <div className={styles.rightSection}>
                    {/* Search */}
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm"
                            className={styles.searchInput}
                        />
                    </div>

                    {/* User Actions */}
                    <div className={styles.userActions}>
                        <button className={styles.iconBtn}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
