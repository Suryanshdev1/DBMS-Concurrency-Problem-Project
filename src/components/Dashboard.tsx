"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { unsafeWithdraw } from '../lib/unsafe-logic';
import ModeToggle from './ModeToggle';
import MemberCard from './MemberCard';
import TransactionLog, { Log } from './TransactionLog';

const MEMBERS = ['Suryansh', 'Suhana', 'Tanusri', 'Subhranil'];
const INITIAL_BALANCE = 20000;

export default function Dashboard() {
  const [balance, setBalance] = useState<number>(INITIAL_BALANCE);
  const [isSafe, setIsSafe] = useState<boolean>(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const { data: accData } = await supabase
      .from('bank_account')
      .select('balance')
      .eq('id', 1)
      .single();
    if (accData) setBalance(Number(accData.balance));

    const { data: logData } = await supabase
      .from('transactions')
      .select('*')
      .order('id', { ascending: false })
      .limit(8);
    if (logData) setLogs(logData as Log[]);
  }, []);

  // Poll the DB so the UI reflects real state.
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Keep the body theme in sync with the mode (also correct on first load).
  useEffect(() => {
    document.body.classList.toggle('unsafe-mode', !isSafe);
    return () => document.body.classList.remove('unsafe-mode');
  }, [isSafe]);

  // Auto-hide messages.
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  const handleWithdraw = async (amount: number, member: string) => {
    try {
      if (!isSafe) {
        await unsafeWithdraw(amount, member);
      } else {
        const { error } = await supabase.rpc('safe_withdraw', {
          withdrawal_amount: amount,
          member,
        });
        if (error) throw new Error(error.message);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage(`Transaction failed for ${member}: ${msg}`);
    } finally {
      fetchData();
    }
  };

  const handleReset = async () => {
    const { error } = await supabase.rpc('reset_demo');
    setMessage(error ? `Reset failed: ${error.message}` : 'Demo reset: balance ₹20,000.');
    fetchData();
  };

  const totalLogged = logs.reduce((s, l) => s + Number(l.amount), 0);

  return (
    <div className="w-full max-w-5xl flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-center tracking-wider uppercase drop-shadow-lg">
        Team 5 <span style={{ color: 'var(--accent-color)' }}>Joint Account</span>
      </h1>
      <p className="text-gray-400 mb-8 font-medium">DBMS Concurrency &amp; Isolation Demo</p>

      <ModeToggle isSafe={isSafe} setIsSafe={setIsSafe} />

      <div
        className={`text-5xl md:text-6xl font-black mb-4 p-8 rounded-2xl border-4 shadow-2xl transition-all duration-300 ${
          isSafe
            ? 'border-green-500 text-green-400 shadow-green-500/20'
            : 'border-red-600 text-red-500 shadow-red-600/40 bg-black/50'
        }`}
      >
        ₹{balance.toLocaleString('en-IN')}
      </div>

      <p className="text-sm text-gray-400 mb-6 h-5">
        {!isSafe && logs.length > 0 && INITIAL_BALANCE - balance < totalLogged
          ? '⚠ Lost update! Logged debits exceed the money actually deducted.'
          : ''}
      </p>

      {message && (
        <div className="mb-6 px-4 py-2 rounded-lg bg-black/60 border border-gray-600 text-sm">{message}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-8">
        {MEMBERS.map((m) => (
          <MemberCard key={m} name={m} onWithdraw={handleWithdraw} isSafe={isSafe} />
        ))}
      </div>

      <button
        onClick={handleReset}
        className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-white/10 transition"
      >
        Reset demo (₹20,000)
      </button>

      <TransactionLog logs={logs} />
    </div>
  );
}
