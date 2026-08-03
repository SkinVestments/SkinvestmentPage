import { supabase } from '@/utils/supabaseClient';

export type EditTransactionInput = {
  transactionId: string;
  quantity: number;
  price: number;
  date: string; // ISO date or datetime
  isInvestment: boolean;
};

export async function editTransaction(input: EditTransactionInput): Promise<void> {
  const { error } = await supabase.rpc('edit_transaction', {
    p_transaction_id: input.transactionId,
    p_new_quantity: input.quantity,
    p_new_price: input.price,
    p_new_date: input.date,
    p_new_is_investment: input.isInvestment,
  });
  if (error) throw error;
}
