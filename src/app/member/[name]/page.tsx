"use client";
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useBank } from '@/lib/useBank';
import { MEMBERS, inr } from '@/lib/members';
import WithdrawPanel from '@/components/WithdrawPanel';
import TransactionLog from '@/components/TransactionLog';

export default function MemberPage({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name);
  const { balance, isSafe, logs, message, withdraw } = useBank();

  if (!(MEMBERS as readonly string[]).includes(name)) notFound();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-10 flex flex-col items-center gap-6">
      <div className="w-full flex items-center justify-between">
        <Link href="/" className="btn-ghost">← All members</Link>
        <span className={`mode-pill ${isSafe ? 'mode-safe' : 'mode-unsafe'}`}>
          {isSafe ? 'Safe mode' : 'Unsafe mode'}
        </span>
      </div>

      <div className="flex items-center gap-4 self-start">
        <span className="avatar">{name.charAt(0)}</span>
        <div>
          <p className="text-sm text-muted">Signed in as</p>
          <h1 className="text-3xl font-extrabold">{name}</h1>
        </div>
      </div>

      <div className="panel w-full p-6 text-center">
        <p className="text-sm text-muted">Joint account balance</p>
        <p className="text-5xl font-black mt-1 text-accent">{inr(balance)}</p>
      </div>

      {message && <div className="panel w-full px-4 py-2 text-sm">{message}</div>}

      <WithdrawPanel name={name} onWithdraw={withdraw} />
      <TransactionLog logs={logs} />
    </div>
  );
}