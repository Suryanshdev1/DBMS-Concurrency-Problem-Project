"use client";
import { useState } from 'react';

interface MemberProps {
  name: string;
  onWithdraw: (amount: number, member: string) => Promise<void>;
  isSafe: boolean;
}

export default function MemberCard({ name, onWithdraw, isSafe }: MemberProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      await onWithdraw(5000, name); // ₹5000 fixed debit for demo
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border-2 transition-colors duration-300 flex flex-col items-center gap-4 ${
        isSafe ? 'border-green-500/30 bg-green-900/10' : 'border-red-500/30 bg-red-900/10'
      }`}
    >
      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
        {name.charAt(0)}
      </div>
      <h3 className="font-semibold text-lg">{name}</h3>
      <button
        onClick={handleAction}
        disabled={loading}
        className={`px-4 py-2 rounded-lg font-bold w-full text-white transition-all duration-300 ${
          loading ? 'opacity-50 cursor-not-allowed animate-pulse' : 'hover:scale-105'
        } ${
          isSafe
            ? 'bg-green-600 hover:bg-green-500'
            : 'bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
        }`}
      >
        {loading ? 'Processing...' : 'Debit ₹5,000'}
      </button>
    </div>
  );
}
