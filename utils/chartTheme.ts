export const chartTooltipStyle = {
  backgroundColor: 'var(--color-surface)',
  borderColor: 'var(--color-card-border)',
  color: 'var(--color-text-primary)',
  borderRadius: '8px',
};

export const chartTooltipItemStyle = {
  color: 'var(--color-text-primary)',
  fontWeight: 'bold' as const,
};

export const chartProfitStroke = 'var(--color-profit)';
export const chartLossStroke = 'var(--color-loss)';
export const chartAccentStroke = 'var(--color-accent)';

export const chartAxisTickStyle = {
  fill: 'var(--color-text-tertiary)',
  fontSize: 10,
};

export const chartAxisLineStyle = { stroke: 'var(--color-card-border)' };

export const formatChartYAxis = (value: number): string => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '';
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${Math.round(n)}`;
};

export const formatChartXAxis = (label: string): string => {
  const d = new Date(label);
  if (!Number.isNaN(d.getTime())) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d);
  }
  return label.length > 10 ? `${label.slice(0, 10)}…` : label;
};
