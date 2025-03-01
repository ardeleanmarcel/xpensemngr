import chalk from "chalk";

export const log = {
  info: (message: string): void => {
    console.log(chalk.bold(message));
  },
  warn: withPrefix("[WARNING!]")(logWarn),
  error: (message: string): void => {
    console.log(chalk.bold.red("[ERROR] " + message));
  },
  success: (message: string): void => {
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
