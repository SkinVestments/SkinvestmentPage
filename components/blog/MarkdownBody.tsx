import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Link } from 'react-router-dom';

type MarkdownBodyProps = {
  content: string;
  className?: string;
};

const INTERNAL_ORIGINS = ['https://skinvestments.app', 'http://skinvestments.app'];

function hrefToInternalPath(href: string | undefined): string | null {
  if (!href) return null;
  if (href.startsWith('/') && !href.startsWith('//')) return href.replace(/\/+$/, '') || '/';

  for (const origin of INTERNAL_ORIGINS) {
    if (href.startsWith(origin)) {
      const path = href.slice(origin.length) || '/';
      const normalized = path.startsWith('/') ? path : `/${path}`;
      return normalized.replace(/\/+$/, '') || '/';
    }
  }

  return null;
}

const markdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="font-display text-2xl sm:text-3xl font-bold text-steam-text mt-10 mb-4 tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display text-xl sm:text-2xl font-bold text-steam-text mt-8 mb-3 tracking-tight">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="text-steam-secondary leading-relaxed">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc pl-6 space-y-2 text-steam-secondary">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 space-y-2 text-steam-secondary">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-steam-text">{children}</strong>,
  a: ({ href, children }) => {
    const internal = hrefToInternalPath(href);
    if (internal) {
      return (
        <Link to={internal} className="text-steam-accent hover:underline font-medium">
          {children}
        </Link>
      );
    }
    const safeHref = href?.replace(/^http:\/\/skinvestments\.app/i, 'https://skinvestments.app');
    return (
      <a
        href={safeHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-steam-accent hover:underline font-medium"
      >
        {children}
      </a>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-steam-accent/60 pl-4 italic text-steam-tertiary my-6">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-steam-elevated px-1.5 py-0.5 rounded text-sm text-steam-accent">
      {children}
    </code>
  ),
  hr: () => <hr className="border-steam-border/60 my-10" />,
};

export const MarkdownBody: React.FC<MarkdownBodyProps> = ({ content, className = '' }) => (
  <div
    className={`blog-md text-steam-secondary text-base sm:text-lg leading-relaxed space-y-4 ${className}`}
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  </div>
);
