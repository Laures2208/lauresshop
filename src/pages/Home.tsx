import React from 'react';
import { Hero } from '../components/Hero';
import { AccountList } from '../components/AccountList';
import { RentSlot } from '../components/RentSlot';
import { RankBoost } from '../components/RankBoost';

export const Home: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col w-full">
      <Hero />
      <div className="border-y border-red-900/20 shadow-[inset_0_0_50px_rgba(220,38,38,0.03)] py-4">
        <AccountList />
      </div>
      <RentSlot />
      <div className="border-t border-red-900/20 shadow-[inset_0_0_50px_rgba(220,38,38,0.03)] py-4 pb-16">
        <RankBoost />
      </div>
    </div>
  );
};
