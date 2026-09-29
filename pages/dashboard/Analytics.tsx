import React from 'react';
import { SummaryCards } from '../../components/analytics/SummaryCards';
import { AllocationChart } from '../../components/analytics/AllocationChart';
import { DropsChart } from '../../components/analytics/DropsChart';
import { QualityStructureChart } from '../../components/analytics/QualityStructureChart';
import { StagnationDetector } from '../../components/analytics/StagnationDetector';
import { ProfitHeatmap } from '../../components/analytics/ProfitHeatmap';
import { PortfolioDiversityTreemap } from '../../components/analytics/PortfolioDiversityTreemap';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useSubscriptionPlan } from '@/hooks/useSubscriptionPlan';
import { AdSlot } from '@/components/ads/AdSlot';
import { MANAGE_SUBSCRIPTION_SETTINGS_PATH } from '@/constants/settingsLinks';
import { usePublisherContentReady } from '@/hooks/usePublisherContentReady';

const Analytics = () => {
  const { hasPremium: userHasPremium } = useSubscriptionPlan();
  const adsContentReady = usePublisherContentReady();

  return (
    <div className="text-steam-text animate-fade-in pb-10 min-w-0 overflow-x-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-steam-text mb-1">Analytics</h1>
          <p className="text-steam-secondary">Deep dive into your portfolio performance.</p>
        </div>
        
        {!userHasPremium && (
           <Link
             to={MANAGE_SUBSCRIPTION_SETTINGS_PATH}
             className="inline-flex items-center gap-2 rounded-xl border border-steam-accent/40 bg-steam-accent/10 px-5 py-2.5 text-sm font-bold text-steam-accent hover:bg-steam-accent/15 transition-colors"
           >
             <Sparkles className="w-4 h-4" /> Upgrade to PRO
           </Link>
        )}
      </div>

      {/* RZĄD 1: METRYKI */}
      <SummaryCards />

      <AdSlot slotKey="analytics" className="mb-6" contentReady={adsContentReady} />

      {/* RZĄD 2: GŁÓWNE WYKRESY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <AllocationChart />
        </div>
        <div className="lg:col-span-2">
          <DropsChart hasPremiumAccess={userHasPremium} />
        </div>
      </div>

      {/* RZĄD 3: DIVERSITY TREEMAP */}
      <div className="mb-6">
        <PortfolioDiversityTreemap />
      </div>

      {/* RZĄD 4: JAKOŚĆ I DODATKI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="lg:col-span-1">
          <QualityStructureChart />
        </div>

        <div className="lg:col-span-1">
          <StagnationDetector hasPremiumAccess={userHasPremium} />
        </div>
      </div>

      {/* RZĄD 5: PROFIT HEATMAP */}
      <div className="grid grid-cols-1 gap-6">
        <ProfitHeatmap />
      </div>

    </div>
  );
};

export default Analytics;