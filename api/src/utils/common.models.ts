import { z } from 'zod';

export const password = z.string().min(8).max(20);
export const email = z.string().email(); // TODO (Valle) -> add a unique elements array schema (so that you can't send ids 1, 2 and 1 again)
// TODO (Valle) -> add maximum lengths to arrays on endpoint schemas

export const amountSchema = z
  .number()
  .positive()
  .lt(1000000000000)
  .refine((num) => {
    const asString = String(num);
    const decimals = asString.split('.')[1];
    return !decimals || decimals.length < 3;
  }, 'amount should be a number with maximum 2 decimals');

export const dbIdSchema = z.number().int().positive();
