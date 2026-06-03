'use client';

import { FormEvent, useState } from 'react';

import styles from './WaitlistForm.module.css';

type Variant = 'inline' | 'card';

const MESSAGES = {
  success: "You're on the list. We'll email you when SkinSense opens early access.",
  error: 'Something went wrong. Please try again in a moment.',
  invalid: 'Please enter a valid email address.',
};

export function WaitlistForm({
  variant = 'inline',
  id = 'waitlist',
}: {
  variant?: Variant;
  id?: string;
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    const fd = new FormData(e.currentTarget);
    const website = String(fd.get('website') ?? '');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok) {
        setStatus('error');
        setFeedback(data.error === 'invalid_email' ? MESSAGES.invalid : MESSAGES.error);
        return;
      }

      setStatus('success');
      setFeedback(MESSAGES.success);
      setEmail('');
    } catch {
      setStatus('error');
      setFeedback(MESSAGES.error);
    }
  }

  return (
    <form
      className={`${styles.form} ${variant === 'card' ? styles.formCard : styles.formInline}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <label className="sr-only" htmlFor={`email-${id}`}>
        Email address
      </label>
      <input
        id={`email-${id}`}
        className={styles.input}
        type="email"
        name="email"
        autoComplete="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === 'loading' || status === 'success'}
      />
      <button
        type="submit"
        className={styles.submit}
        disabled={status === 'loading' || status === 'success'}
      >
        {status === 'loading' ? 'Joining…' : 'Join Waitlist'}
      </button>
      <input
        className={styles.honeypot}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />
      {feedback ? (
        <p
          className={`${styles.message} ${
            status === 'success' ? styles.messageSuccess : styles.messageError
          }`}
          role="status"
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
