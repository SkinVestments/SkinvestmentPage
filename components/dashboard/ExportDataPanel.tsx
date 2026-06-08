import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Database,
  Download,
  FileJson,
  FileSpreadsheet,
  Loader2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { MANAGE_SUBSCRIPTION_SETTINGS_PATH } from '@/constants/settingsLinks';
import {
  downloadTextFile,
  exportFilename,
  fetchFullDataExport,
  fetchPortfolioExport,
  fetchTransactionsExport,
  rowsToCsv,
} from '@/utils/dataExport';

type ExportKind = 'full' | 'portfolio' | 'transactions';

interface ExportDataPanelProps {
  userId?: string;
  canExportCsv: boolean;
  canExportFull: boolean;
}

export const ExportDataPanel: React.FC<ExportDataPanelProps> = ({
  userId,
  canExportCsv,
  canExportFull,
}) => {
  const [loading, setLoading] = useState<ExportKind | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runExport = async (kind: ExportKind) => {
    if (!userId) {
      setError('Sign in to export your data.');
      return;
    }

    setLoading(kind);
    setError(null);

    try {
      if (kind === 'full') {
        const data = await fetchFullDataExport();
        downloadTextFile(
          JSON.stringify(data, null, 2),
          exportFilename('full-export', 'json'),
          'application/json',
        );
      } else if (kind === 'portfolio') {
        const rows = await fetchPortfolioExport(userId);
        downloadTextFile(
          rowsToCsv(rows),
          exportFilename('portfolio', 'csv'),
          'text/csv;charset=utf-8',
        );
      } else {
        const rows = await fetchTransactionsExport(userId);
        downloadTextFile(
          rowsToCsv(rows),
          exportFilename('transactions', 'csv'),
          'text/csv;charset=utf-8',
        );
      }
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Export failed. Please try again.';
      setError(message);
    } finally {
      setLoading(null);
    }
  };

  if (!canExportCsv) {
    return (
      <div className="bg-steam-card border border-steam-border rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-14 h-14 rounded-full bg-steam-accent/15 flex items-center justify-center text-steam-accent mb-4">
            <Lock size={24} />
          </div>
          <h4 className="font-bold text-steam-text text-xl mb-2">Data export — Pro feature</h4>
          <p className="text-sm text-steam-secondary max-w-md mb-6 leading-relaxed">
            Export your portfolio and transactions as CSV, or download a full account archive on Pro
            Max. Upgrade to unlock exports.
          </p>
          <Link
            to={MANAGE_SUBSCRIPTION_SETTINGS_PATH}
            className="inline-flex items-center gap-2 px-6 py-3 bg-steam-accent hover:brightness-110 text-white font-bold rounded-xl transition-all"
          >
            <Sparkles size={16} /> Upgrade plan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-steam-card border border-steam-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
      <div className="flex items-start gap-4 mb-2">
        <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
          <Database size={22} />
        </div>
        <div>
          <h4 className="font-bold text-steam-text text-xl mb-1">Export your data</h4>
          <p className="text-sm text-steam-secondary leading-relaxed">
            Download a copy of your portfolio and history. Pro includes CSV exports; Pro Max adds a
            full JSON archive (account, profile, Steam links, collections, snapshots).
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <ExportButton
          icon={<FileSpreadsheet size={18} />}
          label="Portfolio CSV"
          sub="Current holdings"
          loading={loading === 'portfolio'}
          disabled={!!loading}
          onClick={() => runExport('portfolio')}
        />
        <ExportButton
          icon={<FileSpreadsheet size={18} />}
          label="Transactions CSV"
          sub="Buy, sell & drops"
          loading={loading === 'transactions'}
          disabled={!!loading}
          onClick={() => runExport('transactions')}
        />
        <ExportButton
          icon={<FileJson size={18} />}
          label="Full archive"
          sub="Pro Max · JSON"
          loading={loading === 'full'}
          disabled={!!loading || !canExportFull}
          locked={!canExportFull}
          onClick={() => runExport('full')}
        />
      </div>

      {!canExportFull && (
        <p className="text-[11px] text-steam-tertiary text-center pt-1">
          Full JSON export requires{' '}
          <Link to={MANAGE_SUBSCRIPTION_SETTINGS_PATH} className="text-steam-accent hover:underline">
            Pro Max
          </Link>
          .
        </p>
      )}
    </div>
  );
};

interface ExportButtonProps {
  icon: React.ReactNode;
  label: string;
  sub: string;
  loading: boolean;
  disabled: boolean;
  locked?: boolean;
  onClick: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  icon,
  label,
  sub,
  loading,
  disabled,
  locked,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || locked}
    className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${
      locked
        ? 'border-steam-border/50 bg-steam-elevated/40 opacity-50 cursor-not-allowed'
        : 'border-steam-border bg-steam-bg hover:border-steam-accent/40 hover:bg-steam-hover disabled:opacity-60'
    }`}
  >
    <div className="text-steam-accent">
      {loading ? <Loader2 size={18} className="animate-spin" /> : locked ? <Lock size={18} /> : icon}
    </div>
    <div>
      <div className="text-sm font-bold text-steam-text">{label}</div>
      <div className="text-[10px] text-steam-tertiary mt-0.5">{sub}</div>
    </div>
    {!locked && !loading && <Download size={14} className="text-steam-tertiary" />}
  </button>
);
