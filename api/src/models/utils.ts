import z from 'zod';

export const amountSchema = z
  .number()
  .positive()
  .lt(1_000_000_000_000)
  .refine((num) => {
    const asString = String(num);
    const decimals = asString.split('.')[1];
    return !decimals || decimals.length < 3;
  }, 'amount should be a number with maximum 2 decimals');

export const dbIdSchema = z.number().int().positive();
