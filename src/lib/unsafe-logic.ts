import { supabase } from './supabase';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function unsafeWithdraw(amount: number, member: string, method: string) {
  const { data, error: readError } = await supabase
    .from('bank_account').select('balance').eq('id', 1).single();
  if (readError || !data) throw new Error('Failed to read balance');

  const currentBalance = Number(data.balance);

  await delay(4000); // THE TRAP: other transactions read the same balance here

  if (currentBalance < amount) throw new Error('Insufficient balance');
  const newBalance = currentBalance - amount;

  const { error: updateError } = await supabase
    .from('bank_account').update({ balance: newBalance }).eq('id', 1);
  if (updateError) throw new Error(updateError.message);

  const { error: logError } = await supabase
    .from('transactions')
    .insert([{ member_name: member, amount, method, mode: 'Unsafe' }]);
  if (logError) throw new Error(logError.message);

  return newBalance;
}