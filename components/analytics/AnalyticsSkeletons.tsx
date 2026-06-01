import React from 'react';
import { Shimmer } from '@/components/ui/Shimmer';

export const SummaryCardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg"
      >
        <div className="flex justify-between items-start mb-4">
          <Shimmer className="w-12 h-12 rounded-xl" />
          <Shimmer className="h-3 w-20 rounded" />
        </div>
        <Shimmer className="h-8 w-32 mb-2 rounded-md" />
        <Shimmer className="h-3 w-24 rounded" />
      </div>
    ))}
    {[0, 1].map((i) => (
      <div
        key={`wide-${i}`}
        className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg md:col-span-2 lg:col-span-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <Shimmer className="w-12 h-12 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-3 w-28 rounded" />
            <Shimmer className="h-3 w-full max-w-md rounded" />
          </div>
        </div>
        <Shimmer className="h-9 w-40 rounded-md" />
      </div>
    ))}
  </div>
);

export const ChartCardSkeleton = ({
  titleWidth = 'w-40',
  height = 'min-h-[300px]',
  children,
}: {
  titleWidth?: string;
  height?: string;
  children?: React.ReactNode;
}) => (
  <div
    className={`bg-steam-card p-6 rounded-2xl border border-steam-border shadow-lg h-full flex flex-col ${height}`}
  >
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Shimmer className="w-5 h-5 rounded" />
        <Shimmer className={`h-5 ${titleWidth} rounded-md`} />
      </div>
      <Shimmer className="h-8 w-24 rounded-lg shrink-0" />
    </div>
    {children ?? <Shimmer className="flex-1 min-h-[220px] rounded-xl" />}
  </div>
);

export const AllocationChartSkeleton = () => (
  <ChartCardSkeleton height="min-h-[380px]" titleWidth="w-44">
    <div className="flex flex-col flex-1 gap-6">
      <div className="flex justify-center py-2">
        <Shimmer className="w-48 h-48 rounded-full" />
      </div>
      <div className="space-y-3 mt-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <Shimmer className="w-3 h-3 rounded-full shrink-0" />
              <Shimmer className="h-4 flex-1 max-w-[140px] rounded" />
            </div>
            <Shimmer className="h-4 w-12 rounded shrink-0" />
          </div>
        ))}
      </div>
    </div>
  </ChartCardSkeleton>
);

export const AreaChartSkeleton = () => (
  <div className="flex-1 min-h-[300px] relative rounded-xl overflow-hidden">
    <Shimmer className="absolute inset-0 rounded-xl opacity-80" />
    <svg
      className="absolute inset-0 w-full h-full text-steam-elevated/60"
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0,180 Q80,120 160,140 T320,60 T400,40 L400,200 L0,200 Z"
        fill="currentColor"
        className="opacity-30"
      />
    </svg>
  </div>
);

export const QualityPyramidSkeleton = () => (
  <div className="bg-steam-card rounded-2xl border border-steam-border shadow-lg min-h-[420px] flex flex-col p-4 sm:p-6">
    <div className="flex items-center gap-2 mb-2">
      <Shimmer className="w-5 h-5 rounded shrink-0" />
      <Shimmer className="h-5 w-56 rounded-md" />
    </div>
    <Shimmer className="h-3 w-full max-w-lg rounded mb-6" />
    <div className="flex-1 flex flex-col items-center justify-end gap-2 py-4">
      {[100, 82, 64, 46, 28].map((w, i) => (
        <Shimmer
          key={i}
          className="h-10 rounded-md"
          style={{ width: `${w}%`, maxWidth: '100%' }}
        />
      ))}
    </div>
  </div>
);

export const StagnationListSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-3 p-3 rounded-xl border border-steam-border/50 bg-steam-bg/50"
      >
        <Shimmer className="w-14 h-10 rounded-md shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Shimmer className="h-4 w-[75%] max-w-[220px] rounded" />
          <Shimmer className="h-3 w-[50%] max-w-[120px] rounded" />
        </div>
        <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
          <Shimmer className="h-4 w-16 rounded" />
          <Shimmer className="h-3 w-12 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export const HeatmapGridSkeleton = () => (
  <div className="flex-1 min-h-[220px] space-y-2">
    <div className="flex gap-1">
      <Shimmer className="w-10 h-6 rounded shrink-0" />
      {Array.from({ length: 7 }).map((_, i) => (
        <Shimmer key={i} className="flex-1 h-6 rounded" />
      ))}
    </div>
    {Array.from({ length: 6 }).map((_, row) => (
      <div key={row} className="flex gap-1">
        <Shimmer className="w-10 h-8 rounded shrink-0" />
        {Array.from({ length: 7 }).map((_, col) => (
          <Shimmer
            key={col}
            className="flex-1 h-8 rounded"
            style={{ opacity: 0.4 + ((row + col) % 4) * 0.15 }}
          />
        ))}
      </div>
    ))}
  </div>
);
