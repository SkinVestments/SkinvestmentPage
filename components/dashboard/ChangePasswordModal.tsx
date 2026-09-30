import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';
import { getPrimaryAuthProvider, userHasEmailPassword } from '@/utils/authProviders';
import type { User } from '@supabase/supabase-js';
import { Modal } from '@/components/ui/Modal';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const MIN_PASSWORD_LENGTH = 6;

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const canChangePassword = userHasEmailPassword(user);
  const oauthProvider = getPrimaryAuthProvider(user);

  useEffect(() => {
    if (!isOpen) return;
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setError('');
    setSuccess(false);
    setIsSaving(false);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!user?.email) {
      setError('No email on this account.');
      return;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`New password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from the current one.');
      return;
    }

    setIsSaving(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('Current password is incorrect.');
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not update password.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change password"
      description={
        canChangePassword
          ? 'Enter your current password, then choose a new one.'
          : 'Password is managed by your sign-in provider.'
      }
      maxWidth="md"
    >
      {!canChangePassword ? (
        <div className="rounded-xl border border-steam-border bg-steam-bg/50 p-4 text-sm text-steam-secondary leading-relaxed">
          You signed in with{' '}
          <span className="font-bold text-steam-text capitalize">{oauthProvider}</span>. Change
          your password in that account&apos;s security settings, or link an email password from
          the login page.
        </div>
      ) : success ? (
        <div className="flex flex-col items-center text-center py-4 gap-3">
          <CheckCircle2 className="w-12 h-12 text-green-400" />
          <p className="text-steam-text font-bold">Password updated</p>
          <p className="text-sm text-steam-secondary">
            Your password has been changed successfully.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="pressable mt-2 w-full py-3 rounded-xl font-bold bg-steam-accent text-white hover:opacity-90"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <PasswordField
            id="current-password"
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrent}
            onToggleShow={() => setShowCurrent((v) => !v)}
            autoComplete="current-password"
          />

          <PasswordField
            id="new-password"
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            onToggleShow={() => setShowNew((v) => !v)}
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
          />

          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            onToggleShow={() => setShowConfirm((v) => !v)}
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
          />

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="pressable flex-1 py-3 rounded-xl font-bold text-steam-secondary hover:text-steam-text hover:bg-steam-hover border border-steam-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="pressable flex-1 py-3 rounded-xl font-bold bg-steam-accent hover:opacity-90 text-white shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating…
                </>
              ) : (
                'Update password'
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
  autoComplete: string;
  minLength?: number;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  value,
  onChange,
  show,
  onToggleShow,
  autoComplete,
  minLength,
}) => (
  <div>
    <label htmlFor={id} className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-1.5 block">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        className="theme-input w-full rounded-xl p-3 pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        minLength={minLength}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="pressable absolute right-3 top-1/2 -translate-y-1/2 text-steam-tertiary hover:text-steam-secondary"
        tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);
