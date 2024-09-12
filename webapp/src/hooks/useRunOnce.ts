import React from 'react';

export function useRunOnce<T>(fn: () => T) {
  const hasRun = React.useRef(false);
  if (!hasRun.current) {
    hasRun.current = true;
    return fn();
  }
}
