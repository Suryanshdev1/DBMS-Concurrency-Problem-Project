"use client";
import { useState } from 'react';
import { PAYMENT_METHODS } from '@/lib/members';

interface Props {
  name: string;
  onWithdraw: (amount: number, member: string, method: string) => Promise<void>;
}

export default function WithdrawPanel({ name, onWithdraw }: Props) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<string>(PAYMENT_METHODS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError('Enter an amount greater than 0.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onWithdraw(value, name, method);
      setAmount('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="panel w-full p-6 flex flex-col gap-5">
      <h2 className="text-xl font-bold">Debit money</h2>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-muted">Amount (₹)</span>
        <input
          type="number" min="1" step="1" inputMode="numeric"
          value={amount} onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 25000" className="field text-2xl font-bold"
        />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm text-muted mb-1">Pay using</legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              type="button" key={m} onClick={() => setMethod(m)} aria-pressed={method === m}
              className={`method ${method === m ? 'method-active' : ''}`}
            >
              {m}
            </button>
          ))}
        </div>
      </fieldset>

      {error && <p className="text-sm text-accent">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Processing…' : `Debit via ${method}`}
      </button>
    </form>
  );
}