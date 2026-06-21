import React from 'react';
import { AccountList } from '../components/AccountList';
import { RentSlot } from '../components/RentSlot';
import { RankBoost } from '../components/RankBoost';
import { DynamicServicesList } from '../components/DynamicServicesList';
import ZaloWidget from '../components/ZaloWidget';
import { HeroSection } from '../components/HeroSection';
import { useShop } from '../context/ShopContext';

export const Home: React.FC = () => {
  const { serviceVisibility } = useShop();

  return (
    <div className="flex-1 flex flex-col w-full relative">
      <HeroSection />
      
      <div className="border-y border-red-900/20 shadow-[inset_0_0_50px_rgba(220,38,38,0.03)] py-4 mt-8">
        <DynamicServicesList />
      </div>

      {serviceVisibility.showAccounts && (
        <div className="border-b border-red-900/20 shadow-[inset_0_0_50px_rgba(220,38,38,0.03)] py-4 mt-8">
          <AccountList />
        </div>
      )}
      {serviceVisibility.showRentSlot && (
        <RentSlot />
      )}
      {serviceVisibility.showRankBoost && (
        <div className="border-t border-red-900/20 shadow-[inset_0_0_50px_rgba(220,38,38,0.03)] py-4 pb-16">
          <RankBoost />
        </div>
      )}
      <ZaloWidget />
    </div>
  );
};
