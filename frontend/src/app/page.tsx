'use client';

import Navbar from '@/components/Navbar';
import MarketOverview from '@/components/MarketOverview';
import CoinTable from '@/components/CoinTable';

export default function Home() {
  return (
    <main>
      <Navbar />
      <MarketOverview />
      <CoinTable />
    </main>
  );
}
