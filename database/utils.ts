import { z } from 'zod';

export const dbCredentialsSchema = z.object({
  dbInstanceIdentifier: z.string(),
  engine: z.string(),
  host: z.string().nonempty(),
  port: z.number().gte(1).lte(65535),
  dbname: z.string().nonempty(),
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});
