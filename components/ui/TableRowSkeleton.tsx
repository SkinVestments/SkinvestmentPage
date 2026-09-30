import React from 'react';
import { Shimmer } from '@/components/ui/Shimmer';

/** History table row skeleton — matches ~88px content row (p-5 + 48px icon). */
export const HistoryTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 8 }) => (
  <div className="overflow-x-auto" aria-busy="true" aria-label="Loading transactions">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-steam-surface text-steam-tertiary text-xs font-bold uppercase tracking-wider border-b border-steam-border">
          <th className="p-5 pl-8">Type</th>
          <th className="p-5">Item Details</th>
          <th className="p-5 text-right">Unit Price</th>
          <th className="p-5 text-right">Total / Profit</th>
          <th className="p-5 text-right pr-8">Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-steam-border/50">
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i} className="h-[5.5rem]">
            <td className="p-5 pl-8 align-middle">
              <Shimmer className="h-8 w-20 rounded-lg" />
            </td>
            <td className="p-5 align-middle">
              <div className="flex items-center gap-4">
                <Shimmer className="w-16 h-12 rounded shrink-0" />
                <div className="space-y-2 flex-1 min-w-0">
                  <Shimmer className="h-4 w-48 max-w-full rounded" />
                  <Shimmer className="h-3 w-16 rounded" />
                </div>
              </div>
            </td>
            <td className="p-5 text-right align-middle">
              <Shimmer className="h-4 w-16 rounded ml-auto" />
            </td>
            <td className="p-5 text-right align-middle">
              <Shimmer className="h-4 w-20 rounded ml-auto mb-2" />
              <Shimmer className="h-3 w-14 rounded ml-auto" />
            </td>
            <td className="p-5 pr-8 text-right align-middle">
              <Shimmer className="h-3 w-20 rounded ml-auto mb-1" />
              <Shimmer className="h-3 w-12 rounded ml-auto" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Panel metric tile skeleton — matches p-5 card with label + xl value. */
export const PanelMetricTileSkeleton: React.FC = () => (
  <div className="bg-steam-card rounded-2xl p-5 border border-steam-border min-h-[5.5rem]">
    <Shimmer className="h-3 w-20 rounded mb-2" />
    <Shimmer className="h-7 w-28 rounded" />
  </div>
);

/** Panel hero value skeleton — matches large total + ROI badge row. */
export const PanelHeroValueSkeleton: React.FC = () => (
  <div className="min-w-0 w-full" aria-busy="true" aria-label="Loading portfolio value">
    <Shimmer className="h-3 w-36 rounded mb-2" />
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
      <Shimmer className="h-10 sm:h-12 md:h-14 w-48 sm:w-64 rounded-md" />
      <Shimmer className="h-7 w-36 rounded-md" />
    </div>
  </div>
);
