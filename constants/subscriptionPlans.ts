import { Crown, Shield, Zap, type LucideIcon } from 'lucide-react';

export type BillingCycle = 'monthly' | 'yearly' | 'lifetime';
export type PlanId = 'free' | 'pro' | 'pro_max';

export interface PlanFeature {
  text: string;
  soon?: boolean;
}

/** Amounts in PLN — yearly is shown as per-month equivalent (billed annually). */
export const PLAN_PRICING: Record<
  PlanId,
  { monthly: number; yearlyPerMonth: number; lifetime: number }
> = {
  free: { monthly: 0, yearlyPerMonth: 0, lifetime: 0 },
  pro: { monthly: 21.99, yearlyPerMonth: 18.33, lifetime: 1309.99 },
  pro_max: { monthly: 38.99, yearlyPerMonth: 32.92, lifetime: 1749.99 },
};

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  /** Short subtitle under the plan name */
  desc: string;
  /** Shown above feature list for paid tiers */
  includesLabel?: string;
  icon: LucideIcon;
  color: string;
  features: PlanFeature[];
  highlight?: boolean;
  elite?: boolean;
  footnote?: string;
  cta: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    desc: 'For casual players & drop collectors.',
    icon: Shield,
    color: 'text-steam-secondary',
    features: [
      { text: 'Link & sync 1 Steam account' },
      { text: '5 collections (up to 1k items each)' },
      { text: 'Full drop tracking & history' },
      { text: 'Basic portfolio charts' },
      { text: 'Web dashboard & inventory' },
    ],
    cta: 'Continue with Starter',
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: 'For active investors tracking market trends.',
    includesLabel: 'Everything in Starter, plus:',
    icon: Zap,
    color: 'text-steam-accent',
    features: [
      { text: 'No ads' },
      { text: 'Link & sync up to 3 Steam accounts' },
      { text: '15 collections (up to 10k items each)' },
      { text: 'Sales values on item charts' },
      { text: 'Custom transaction exports' },
      { text: '3rd party providers integration', soon: true },
      { text: 'Market & price alerts', soon: true },
      { text: 'Advanced charts & widgets', soon: true },
    ],
    highlight: true,
    footnote: 'Lock in this early-bird price forever before new features drop.',
    cta: 'Subscribe to Pro',
  },
  {
    id: 'pro_max',
    name: 'Pro Max',
    desc: 'Unrestricted access. Never miss a market movement.',
    includesLabel: 'Everything in Pro, plus:',
    icon: Crown,
    color: 'text-yellow-500',
    features: [
      { text: 'Link & sync up to 15 Steam accounts' },
      { text: 'Unlimited collections & items' },
      { text: 'Priority 24/7 support' },
      { text: '3rd party providers integration', soon: true },
      { text: 'Exclusive widgets & advanced tools', soon: true },
    ],
    elite: true,
    footnote: 'Lock in this early-bird price forever before new features drop.',
    cta: 'Subscribe to Pro Max',
  },
];

const formatPlnAmount = (value: number) =>
  value.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const getPlanPriceDisplay = (
  planId: PlanId,
  cycle: BillingCycle,
): { price: string; period: string; yearlyNote?: string } => {
  if (planId === 'free') {
    return { price: 'Free', period: 'forever' };
  }

  const amounts = PLAN_PRICING[planId];

  switch (cycle) {
    case 'monthly':
      return {
        price: `PLN ${formatPlnAmount(amounts.monthly)}`,
        period: '/ monthly',
      };
    case 'yearly':
      return {
        price: `PLN ${formatPlnAmount(amounts.yearlyPerMonth)}`,
        period: '/ monthly',
        yearlyNote: 'billed yearly',
      };
    case 'lifetime':
      return {
        price: `PLN ${formatPlnAmount(amounts.lifetime)}`,
        period: 'one-time',
      };
  }
};

/** @deprecated Use getPlanPriceDisplay */
export const getPeriodLabel = (cycle: BillingCycle, planId: PlanId) =>
  getPlanPriceDisplay(planId, cycle).period;

export const getPlanById = (id: PlanId) => SUBSCRIPTION_PLANS.find((p) => p.id === id);
