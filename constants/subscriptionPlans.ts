import { Crown, Shield, Zap, type LucideIcon } from 'lucide-react';

export type BillingCycle = 'monthly' | 'yearly' | 'lifetime';
export type PlanId = 'basic' | 'pro' | 'pro-max';

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  price: Record<BillingCycle, string>;
  desc: string;
  icon: LucideIcon;
  color: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: { monthly: '€0', yearly: '€0', lifetime: '€0' },
    desc: 'Perfect for casual players tracking drops.',
    icon: Shield,
    color: 'text-gray-400',
    features: [
      'Steam Inventory Tracking',
      'Weekly Drop Timer',
      'Basic Portfolio Value',
      '24h Price Updates',
    ],
    cta: 'Use Basic',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: '€4.99', yearly: '€49.90', lifetime: '€299.00' },
    desc: 'For serious flippers and investors.',
    icon: Zap,
    color: 'text-steam-accent',
    features: [
      'Everything in Basic',
      'Multi-Market Aggregation',
      'Portfolio Pulse (Live)',
      'Stagnation Detector',
    ],
    highlight: true,
    cta: 'Choose Pro',
  },
  {
    id: 'pro-max',
    name: 'Pro Max',
    price: { monthly: '€8.99', yearly: '€89.90', lifetime: '€399.00' },
    desc: 'Institutional grade tools & API access.',
    icon: Crown,
    color: 'text-yellow-500',
    features: [
      'Everything in Pro',
      'Private API Access',
      'CSV/Excel Exports',
      'Priority Support',
    ],
    cta: 'Choose Pro Max',
  },
];

export const getPeriodLabel = (cycle: BillingCycle) => {
  switch (cycle) {
    case 'monthly':
      return '/mo';
    case 'yearly':
      return '/yr';
    case 'lifetime':
      return 'one-time';
  }
};

export const getPlanById = (id: PlanId) => SUBSCRIPTION_PLANS.find((p) => p.id === id);
