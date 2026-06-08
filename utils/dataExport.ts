import { supabase } from '@/utils/supabaseClient';

export interface ExportMyDataOptions {
  include_account_details?: boolean;
  include_profile?: boolean;
  include_steam_connections?: boolean;
  include_collections?: boolean;
  include_portfolio_items?: boolean;
  include_transactions?: boolean;
  include_portfolio_snapshots?: boolean;
}

const DEFAULT_EXPORT_OPTIONS: Required<ExportMyDataOptions> = {
  include_account_details: true,
  include_profile: true,
  include_steam_connections: true,
  include_collections: true,
  include_portfolio_items: true,
  include_transactions: true,
  include_portfolio_snapshots: true,
};

export async function fetchFullDataExport(
  options: ExportMyDataOptions = DEFAULT_EXPORT_OPTIONS,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc('export_my_data', {
    ...DEFAULT_EXPORT_OPTIONS,
    ...options,
  });

  if (error) throw error;
  return (data ?? {}) as Record<string, unknown>;
}

export async function fetchPortfolioExport(userId: string): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase.rpc('export_portfolio', {
    target_user_id: userId,
  });

  if (error) throw error;
  return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
}

export async function fetchTransactionsExport(userId: string): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase.rpc('export_transactions', {
    target_user_id: userId,
  });

  if (error) throw error;
  return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
}

function escapeCsvCell(value: unknown): string {
  const raw = value == null ? '' : String(value);
  if (/[",\n\r]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

export function rowsToCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) {
    return 'No data';
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((key) => escapeCsvCell(row[key])).join(',')),
  ];
  return lines.join('\n');
}

export function downloadTextFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportFilename(prefix: string, extension: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `skinvestments-${prefix}-${date}.${extension}`;
}
