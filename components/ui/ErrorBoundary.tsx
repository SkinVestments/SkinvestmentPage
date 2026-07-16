import React from 'react';
import { Link } from 'react-router-dom';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-steam-bg text-steam-text flex items-center justify-center px-4">
          <div className="max-w-md text-center space-y-6">
            <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
            <p className="text-steam-secondary text-sm leading-relaxed">
              The page failed to load. Try refreshing or return to the home page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-xl bg-steam-accent text-white font-bold text-sm"
              >
                Refresh
              </button>
              <Link
                to="/"
                onClick={this.reset}
                className="px-5 py-2.5 rounded-xl border border-steam-border text-steam-text font-bold text-sm hover:bg-steam-hover transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
