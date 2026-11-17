"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { unsafeWithdraw } from './unsafe-logic';
import { INITIAL_BALANCE } from './members';

export interface Log {
  id: number;
  member_name: string;
  amount: number;
  method: string;
  mode: string;
  created_at: string;
}

export function useBank() {
  const [balance, setBalance] = useState<number>(INITIAL_BALANCE);
  const [isSafe, setIsSafeState] = useState<boolean>(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const { data: acc } = await supabase
      .from('bank_account').select('balance, safe_mode').eq('id', 1).single();
    if (acc) {
      setBalance(Number(acc.balance));
      setIsSafeState(Boolean(acc.safe_mode));
    }
    const { data: logData } = await supabase
      .from('transactions').select('*').order('id', { ascending: false }).limit(10);
    if (logData) setLogs(logData as Log[]);
  }, []);

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 1500);
    return () => clearInterval(t);
  }, [fetchData]);

  useEffect(() => {
    document.body.classList.toggle('unsafe-mode', !isSafe);
    return () => document.body.classList.remove('unsafe-mode');
  }, [isSafe]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(t);
  }, [message]);

  const setIsSafe = async (safe: boolean) => {
    setIsSafeState(safe);
    const { error } = await supabase.from('bank_account').update({ safe_mode: safe }).eq('id', 1);
    if (error) setMessage(`Could not change mode: ${error.message}`);
  };

  const withdraw = async (amount: number, member: string, method: string) => {
    try {
      if (!isSafe) {
        await unsafeWithdraw(amount, member, method);
      } else {
        const { error } = await supabase.rpc('safe_withdraw', {
          withdrawal_amount: amount, member, pay_method: method,
        });
        if (error) throw new Error(error.message);
      }
      setMessage(null);
    } catch (err) {
      setMessage(`Transaction failed for ${member}: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      fetchData();
    }
  };

  const reset = async () => {
    const { error } = await supabase.rpc('reset_demo');
    setMessage(error ? `Reset failed: ${error.message}` : 'Demo reset to ₹2,00,000.');
    fetchData();
  };

  return { balance, isSafe, logs, message, setIsSafe, withdraw, reset };
}