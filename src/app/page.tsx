"use client";
import Link from 'next/link';
import { useBank } from '@/lib/useBank';
import { MEMBERS, inr } from '@/lib/members';
import ModeToggle from '@/components/ModeToggle';
import TransactionLog from '@/components/TransactionLog';

export default function Home() {
  const { balance, isSafe, logs, message, setIsSafe, reset } = useBank();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 flex flex-col items-center gap-8">
      <header className="text-center">
        <p className="text-sm tracking-widest uppercase text-muted">DBMS · Concurrency &amp; Isolation</p>
        <h1 className="text-4xl font-extrabold mt-1">
          Team 5 <span className="text-accent">Joint Account</span>
        </h1>
      </header>

      <div className={`mode-banner ${isSafe ? 'mode-safe' : 'mode-unsafe'}`}>
        {isSafe
          ? 'SAFE MODE — row-level locking, transactions run one at a time'
          : 'UNSAFE MODE — no locking, simultaneous debits can be lost'}
      </div>

      <div className="panel w-full p-8 text-center">
        <p className="text-sm text-muted">Available balance</p>
        <p className="text-5xl md:text-6xl font-black mt-1 text-accent">{inr(balance)}</p>
      </div>

      <section className="w-full">
        <h2 className="text-lg font-bold mb-3">Choose your profile</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MEMBERS.map((m) => (
            <Link key={m} href={`/member/${m}`} className="panel profile-card">
              <span className="avatar">{m.charAt(0)}</span>
              <span className="font-semibold">{m}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <ModeToggle isSafe={isSafe} setIsSafe={setIsSafe} />
        <button onClick={reset} className="btn-ghost">Reset demo</button>
      </div>

      {message && <div className="panel px-4 py-2 text-sm">{message}</div>}

      <TransactionLog logs={logs} />
    </div>
  );
}