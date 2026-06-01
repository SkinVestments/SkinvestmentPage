import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  className = '',
  disabled = false,
  'aria-label': ariaLabel,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled || options.length === 0}
        onClick={() => setOpen((o) => !o)}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-bold transition-colors ${
          open
            ? 'border-steam-accent bg-steam-bg text-steam-text ring-2 ring-steam-accent/20'
            : 'border-steam-border bg-steam-bg text-steam-text hover:border-steam-accent/40'
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span className={`truncate ${selected ? 'text-steam-text' : 'text-steam-tertiary font-medium'}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-steam-tertiary transition-transform duration-200 ${
            open ? 'rotate-180 text-steam-accent' : ''
          }`}
          aria-hidden
        />
      </button>

      {open && options.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute z-[60] mt-1.5 w-full max-h-56 overflow-y-auto custom-scrollbar rounded-xl border border-steam-border bg-steam-card shadow-2xl py-1 animate-fade-in"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-steam-accent/12 text-steam-accent font-bold'
                      : 'text-steam-secondary hover:bg-steam-hover hover:text-steam-text font-medium'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0 text-steam-accent" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
