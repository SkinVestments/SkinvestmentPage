import { LucideIcon } from 'lucide-react';

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export type ViewState = 'home' | 'privacy';

export interface NavItem {
  label: string;
  id: string; // Used for scrolling or view switching
  action?: () => void;
}