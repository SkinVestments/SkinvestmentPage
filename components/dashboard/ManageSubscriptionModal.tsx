import React, { useEffect, useState } from 'react';
import { Check, Infinity, Loader2, Sparkles, X } from 'lucide-react';
import {
  BillingCycle,
  PlanId,
  SUBSCRIPTION_PLANS,
  getPeriodLabel,
} from '@/constants/subscriptionPlans';

interface ManageSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId: PlanId;
  currentBillingCycle: BillingCycle;
  onSelectPlan: (planId: PlanId, billingCycle: BillingCycle) => void;
}

export const ManageSubscriptionModal: React.FC<ManageSubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentPlanId,
  currentBillingCycle,
  onSelectPlan,
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(currentBillingCycle);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(currentPlanId);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBillingCycle(currentBillingCycle);
      setSelectedPlanId(currentPlanId);
    }
  }, [isOpen, currentBillingCycle, currentPlanId]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    onSelectPlan(selectedPlanId, billingCycle);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-steam-bg/85 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div
        className="relative z-10 bg-steam-card border border-steam-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscription-modal-title"
      >
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-steam-border shrink-0">
          <div>
            <h3 id="subscription-modal-title" className="text-xl sm:text-2xl font-bold text-steam-text">
              Choose your plan
            </h3>
            <p className="text-sm text-steam-secondary mt-1">
              Pick the subscription that fits your trading style.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-steam-secondary hover:text-steam-text hover:bg-steam-hover transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          {/* Billing cycle */}
          <div className="flex justify-center">
            <div className="bg-steam-bg p-1.5 rounded-xl border border-steam-border flex relative w-full max-w-md">
              {(['monthly', 'yearly', 'lifetime'] as BillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => setBillingCycle(cycle)}
                  className={`relative z-10 flex-1 px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold capitalize transition-colors ${
                    billingCycle === cycle ? 'text-steam-text' : 'text-steam-tertiary hover:text-steam-secondary'
                  }`}
                >
                  {cycle}
                  {cycle === 'yearly' && (
                    <span className="absolute -top-2.5 -right-1 text-[8px] bg-green-500 text-black px-1 py-0.5 rounded-full font-extrabold">
                      -15%
                    </span>
                  )}
                  {cycle === 'lifetime' && (
                    <span className="absolute -top-2.5 -right-1 text-[8px] bg-purple-500 text-steam-text px-1 py-0.5 rounded-full font-extrabold flex items-center gap-0.5">
                      <Infinity size={7} /> DEAL
                    </span>
                  )}
                </button>
              ))}
              <div
                className="absolute top-1.5 bottom-1.5 rounded-lg theme-subtle-strong border border-steam-border/50 transition-all duration-300 w-[calc(33.33%-4px)]"
                style={{
                  left:
                    billingCycle === 'monthly'
                      ? '4px'
                      : billingCycle === 'yearly'
                        ? 'calc(33.33% + 2px)'
                        : 'calc(66.66%)',
                }}
              />
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const isCurrent = currentPlanId === plan.id && currentBillingCycle === billingCycle;
              const Icon = plan.icon;

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative text-left p-5 rounded-2xl border transition-all flex flex-col ${
                    isSelected
                      ? 'border-steam-accent bg-steam-accent/10 ring-2 ring-steam-accent/40'
                      : 'border-steam-border bg-steam-card hover:border-steam-border'
                  } ${plan.highlight && !isSelected ? 'border-steam-accent/30' : ''}`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-steam-accent text-white text-[9px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                      <Sparkles size={10} /> Popular
                    </span>
                  )}
                  {isCurrent && (
                    <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                      Current
                    </span>
                  )}

                  <div className={`w-10 h-10 rounded-xl theme-subtle flex items-center justify-center mb-3 ${plan.color}`}>
                    <Icon size={20} />
                  </div>
                  <h4 className="font-bold text-steam-text text-lg">{plan.name}</h4>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-steam-text">{plan.price[billingCycle]}</span>
                    {plan.id !== 'basic' && (
                      <span className="text-steam-tertiary text-xs">{getPeriodLabel(billingCycle)}</span>
                    )}
                  </div>
                  <p className="text-xs text-steam-secondary mt-2 mb-4 leading-relaxed">{plan.desc}</p>

                  <ul className="space-y-2 flex-1">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs text-steam-secondary">
                        <Check size={12} className="text-green-500 shrink-0 mt-0.5" strokeWidth={3} />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {isSelected && (
                    <div className="mt-4 pt-3 border-t border-steam-accent/20 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-steam-accent">
                        Selected
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 p-5 sm:p-6 border-t border-steam-border shrink-0 bg-steam-bg/50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-steam-secondary hover:text-steam-text hover:bg-steam-hover transition-colors border border-steam-border"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSaving}
            className="flex-1 py-3 rounded-xl font-bold bg-steam-accent hover:opacity-90 text-white transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving…
              </>
            ) : (
              `Confirm ${SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId)?.name ?? 'Plan'}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
