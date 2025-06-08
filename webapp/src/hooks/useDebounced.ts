import { useCallback, useEffect, useMemo, useRef } from 'react';

export function useDebounced(duration: number) {
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  const run = useCallback(
    (fn: () => void) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      timeout.current = window.setTimeout(fn, duration);
    },
    [duration]
  );

  const cancel = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, []);

  return useMemo(() => ({ run, cancel }), [run, cancel]);
}
