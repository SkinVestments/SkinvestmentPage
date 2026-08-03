import { supabase } from '@/utils/supabaseClient';

export type BulkTransactionPayload = {
  item_id: string;
  quantity: number;
  price: number;
  type: 'BUY' | 'SELL' | 'DROP';
  is_investment: boolean;
  transaction_date: string;
  collection_id: string;
  fee_deducted: number;
  realized_profit: number;
};

export async function addTransactionsBulk(
  userId: string,
  transactions: BulkTransactionPayload[],
): Promise<void> {
  const { data, error } = await supabase.rpc('add_transactions_bulk', {
    p_user_id: userId,
    p_transactions: transactions,
  });
  if (error) throw error;

  if (data && typeof data === 'object' && 'success' in data && data.success === false) {
    const msg =
      'message' in data && data.message
        ? String(data.message)
        : 'Transaction rejected by server.';
    throw new Error(msg);
  }
}

export async function sellFromBatch(opts: {
  userId: string;
  itemId: string;
  collectionId: string;
  quantity: number;
  sellPrice: number;
  costBasisUnit: number;
  date: string;
  applySteamFee: boolean;
}): Promise<void> {
  const fee = opts.applySteamFee ? opts.sellPrice * opts.quantity * 0.13 : 0;
  const realizedProfit =
    opts.sellPrice * opts.quantity - opts.costBasisUnit * opts.quantity - fee;

  await addTransactionsBulk(opts.userId, [
    {
      item_id: opts.itemId,
      quantity: opts.quantity,
      price: opts.sellPrice,
      type: 'SELL',
      is_investment: false,
      transaction_date: new Date(opts.date).toISOString(),
      collection_id: opts.collectionId || '',
      fee_deducted: fee,
      realized_profit: realizedProfit,
    },
  ]);
}
