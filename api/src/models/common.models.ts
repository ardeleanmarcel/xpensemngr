import { z } from 'zod';

export const password = z.string().min(8).max(20);
export const email = z.string().email();
