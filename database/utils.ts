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
  warn: withPrefix('[WARNING!]')(logWarn),
  error: (message: string) => {
    console.log(chalk.bold.red('[ERROR] ' + message));
  },
  success: (message: string) => {
    console.log(chalk.bold.green(message));
  },
};

function logWarn(message: string) {
  console.log(chalk.bold.yellow(message));
}

/**
 * Returns a new function that takes a message string and prefixes it with the
 * given `prefix` before passing it to the original function `fn`.
 *
 * @example
 * const warn = withPrefix('[WARNING]')(console.warn);
 * warn('Something went wrong');
 * // Output: [WARNING] Something went wrong
 */
function withPrefix(prefix: string) {
  return (fn: (message: string) => void) => {
    return (message: string) => {
      fn(`${prefix} ${message}`);
    };
  };
}

export function isYes(answer: string) {
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

export function isSnakeCase(str: string) {
  return /^[a-z_]+$/.test(str);
}

export function validateOperationName(mName: string) {
  let err = '';

  if (!mName) err = 'Name is missing!';
  if (!isSnakeCase(mName)) err = 'Names must be snake_cased!';

  if (err) {
    log.error(err);
    throw new Error(err);
  }
}
