"use client";
import { Log } from '@/lib/useBank';
import { inr } from '@/lib/members';

export default function TransactionLog({ logs }: { logs: Log[] }) {
  return (
    <div className="panel w-full p-5">
      <h3 className="text-lg font-bold mb-3">Recent transactions</h3>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-muted text-center italic py-4">No transactions yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex flex-wrap justify-between items-center gap-2 rounded-lg px-3 py-2 bg-white/5">
              <span>
                <b className="text-accent">{log.member_name}</b> debited {inr(log.amount)}
                <span className="text-muted text-sm"> · {log.method}</span>
              </span>
              <span className="chip">{log.mode}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}