import React, { createContext, useContext, type RefObject } from 'react';

const DashboardScrollContext = createContext<RefObject<HTMLElement | null> | null>(null);

export const DashboardScrollProvider: React.FC<{
  scrollRef: RefObject<HTMLElement | null>;
  children: React.ReactNode;
}> = ({ scrollRef, children }) => (
  <DashboardScrollContext.Provider value={scrollRef}>{children}</DashboardScrollContext.Provider>
);

/** Scrollport for dashboard main content (used by sticky tab strips / scroll-edge). */
export function useDashboardScrollRoot(): RefObject<HTMLElement | null> | null {
  return useContext(DashboardScrollContext);
}
