import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ProAnalyticsPaywall } from '@/components/analytics/ProAnalyticsPaywall';
import {
  Workspace,
  WorkspaceEmpty,
  WorkspaceError,
  WorkspaceLoading,
} from '@/components/portfolio-treemap/Workspace';
import { usePortfolioTreemap } from '@/components/portfolio-treemap/usePortfolioTreemap';

async function tryLockLandscape() {
  try {
    const orient = screen.orientation as ScreenOrientation & {
      lock?: (o: string) => Promise<void>;
    };
    if (orient?.lock) await orient.lock('landscape');
  } catch {
    /* optional */
  }
}

async function unlockOrientation() {
  try {
    screen.orientation?.unlock?.();
  } catch {
    /* optional */
  }
}

const PortfolioMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialCategory = params.get('category');
  const { access, load, retry } = usePortfolioTreemap();
  const fsHostRef = useRef<HTMLDivElement>(null);
  const [fsMode, setFsMode] = useState<'off' | 'native' | 'fallback'>('off');
  const exitFocusRef = useRef<HTMLButtonElement>(null);
  const prevOverflow = useRef<string>('');

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        /* ignore */
      }
    }
    await unlockOrientation();
    document.body.style.overflow = prevOverflow.current || '';
    prevOverflow.current = '';
    setFsMode('off');
    window.setTimeout(() => exitFocusRef.current?.focus(), 0);
  }, []);

  const enterFullscreen = useCallback(async () => {
    const host = fsHostRef.current;
    if (!host) return;
    prevOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    void tryLockLandscape();

    try {
      if (host.requestFullscreen) {
        await host.requestFullscreen();
        setFsMode('native');
        return;
      }
    } catch {
      /* fall through to CSS overlay */
    }
    setFsMode('fallback');
  }, []);

  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) {
        void unlockOrientation();
        document.body.style.overflow = prevOverflow.current || '';
        setFsMode((m) => (m === 'native' ? 'off' : m));
      }
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      void unlockOrientation();
    };
  }, []);

  if (access === 'locked') {
    return (
      <div className="text-steam-text animate-fade-in pb-10 max-w-xl mx-auto pt-10 px-4">
        <div className="relative min-h-[320px] rounded-2xl border border-steam-border bg-steam-card overflow-hidden">
          <div className="absolute inset-0 blur-md opacity-30 bg-steam-elevated" aria-hidden />
          <ProAnalyticsPaywall
            from="analytics_portfolio_treemap"
            description="Unlock the interactive portfolio map — zoom every category and inspect each position."
          />
        </div>
        <div className="mt-4 text-center">
          <Link to="/analytics" className="text-sm font-bold text-steam-accent hover:underline">
            Back to Analytics
          </Link>
        </div>
      </div>
    );
  }

  if (access === 'checking' || load.kind === 'loading' || load.kind === 'idle') {
    return (
      <div className="min-h-[60vh]">
        <WorkspaceLoading />
      </div>
    );
  }

  if (load.kind === 'error') {
    return (
      <div className="min-h-[60vh]">
        <WorkspaceError message={load.message} onRetry={retry} />
      </div>
    );
  }

  if (load.kind === 'empty') {
    return (
      <div className="min-h-[60vh]">
        <WorkspaceEmpty />
      </div>
    );
  }

  const portfolio = load.portfolio;
  const isFullscreen = fsMode !== 'off';

  return (
    <div className="text-steam-text animate-fade-in -mx-2 sm:mx-0">
      {!isFullscreen && (
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Portfolio map</h1>
            <p className="text-sm text-steam-secondary">Explore every category and position.</p>
          </div>
          <button
            ref={exitFocusRef}
            type="button"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
          >
            Focus restore
          </button>
        </div>
      )}

      <div
        ref={fsHostRef}
        className={
          fsMode === 'fallback'
            ? 'fixed inset-0 z-[1000] bg-steam-bg flex flex-col min-h-[100dvh]'
            : fsMode === 'native'
              ? 'bg-steam-bg flex flex-col w-full h-full min-h-[100dvh]'
              : 'rounded-2xl border border-steam-border overflow-hidden bg-steam-bg h-[min(78vh,820px)] min-h-[520px] flex flex-col'
        }
        style={fsMode === 'fallback' ? { paddingTop: 'env(safe-area-inset-top)' } : undefined}
      >
        <Workspace
          portfolio={portfolio}
          mode={isFullscreen ? 'fullscreen' : 'page'}
          initialCategoryKey={initialCategory}
          onClosePage={() => navigate('/analytics')}
          onRequestFullscreen={() => void enterFullscreen()}
          onExitFullscreen={() => void exitFullscreen()}
          className="flex-1 min-h-0 h-full"
        />
      </div>
    </div>
  );
};

export default PortfolioMapPage;
