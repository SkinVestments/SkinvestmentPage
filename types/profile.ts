import type { PlanId } from '@/constants/subscriptionPlans';

export interface UserProfile {
  id: string;
  nickname: string | null;
  steam_profile_url: string | null;
  avatar: string | null;
  notify_accept: boolean | null;
  plan_subscription: PlanId | null;
}

export interface UpdateOwnProfileParams {
  nickname?: string | null;
  steam_profile_url?: string | null;
  avatar?: string | null;
  notify_accept?: boolean | null;
}
