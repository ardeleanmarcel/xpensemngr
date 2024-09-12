import { z } from 'zod';

export function extractJwtPayload(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

const authPayloadSchema = z
  .object({
    username: z.string(),
    email: z.string(),
    user_id: z.number().int().positive(),
    exp: z.number().int().positive(),
    iat: z.number().int().positive(),
  })
  .strict();

export function extractAuthPayload(token: string) {
  const payload = extractJwtPayload(token);
  const parsedPayload = authPayloadSchema.parse(payload);
  return parsedPayload;
}
