import React from 'react';
import { SummaryCards } from '../../components/analytics/SummaryCards';
import { AllocationChart } from '../../components/analytics/AllocationChart';
import { DropsChart } from '../../components/analytics/DropsChart';
import { QualityStructureChart } from '../../components/analytics/QualityStructureChart'; // NOWY IMPORT
import { Sparkles } from 'lucide-react';

const Analytics = () => {
  const userHasPremium = true; 

  return (
    <div className="text-white animate-fade-in pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-1">Analytics</h1>
          <p className="text-gray-400">Deep dive into your portfolio performance.</p>
        </div>
        
        {!userHasPremium && (
           <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2">
             <Sparkles className="w-4 h-4" /> Upgrade to PRO
           </button>
        )}
      </div>

      {/* RZĄD 1: METRYKI */}
      <SummaryCards />

      {/* RZĄD 2: GŁÓWNE WYKRESY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <AllocationChart />
        </div>
        <div className="lg:col-span-2">
          <DropsChart hasPremiumAccess={userHasPremium} />
        </div>
      </div>

      {/* RZĄD 3: JAKOŚĆ I DODATKI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lewa kolumna: Quality Structure */}
        <div className="lg:col-span-1">
          <QualityStructureChart />
        </div>
        
        {/* Prawa kolumna: Zarezerwowana na przyszły wykres (np. najlepsze inwestycje) */}
        <div className="lg:col-span-1">
          {/* Możesz tu wstawić kolejny kafelek z wykresem */}
        </div>
      </div>

    </div>
  );
};

export default Analytics;