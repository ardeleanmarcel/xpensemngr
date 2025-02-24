import { z } from 'zod';
import readline from 'readline/promises';
import chalk from 'chalk';

export const dbCredentialsSchema = z.object({
  dbInstanceIdentifier: z.string(),
  engine: z.string(),
  host: z.string().nonempty(),
  port: z.number().gte(1).lte(65535),
  dbname: z.string().nonempty(),
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

const rlInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const rl = {
  question: async (message: string) => {
    return rlInterface.question(chalk.bold(message));
  },
};

export const log = {
  info: (message: string) => {
    console.log(chalk.bold(message));
  },
  error: (message: string) => {
    console.log(chalk.bold.red('[ERROR] ' + message));
  },
  success: (message: string) => {
    console.log(chalk.bold.green(message));
  },
};

export function isYes(answer: string) {
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

export function isSnakeCase(str: string) {
  return /^[a-z_]+$/.test(str);
}
