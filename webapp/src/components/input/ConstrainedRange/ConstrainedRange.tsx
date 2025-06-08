import React, { useEffect, useState } from 'react';

type ConstrainedRangeProps = React.PropsWithoutRef<{
  min: number;
  max: number;
  onChange: (selectedMin: number, selectedMax: number) => void;
}>;

// TODO (Valle) -> add a validation function for min and max. should be integers and min smaller than max
export const ConstrainedRange: React.FunctionComponent<ConstrainedRangeProps> = ({ min = 0, max = 1000, onChange }) => {
  const [minPercent, setMinPercent] = useState(0);
  const [maxPercent, setMaxPercent] = useState(100);

  const valueRange = max - min;

  useEffect(() => {
    onChange(getVal(valueRange, minPercent), getVal(valueRange, maxPercent));
  }, [minPercent, maxPercent, onChange, valueRange]);

  const handleMinPercentChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = parseInt(event.target.value, 10);

    if (Number.isNaN(value)) {
      setMinPercent(0);
      return;
    }

    if (value >= maxPercent) {
      setMinPercent(maxPercent - 1);
      return;
    }

    setMinPercent(value);
  };

  const handleMaxPercentChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = parseInt(event.target.value, 10);

    if (Number.isNaN(value)) {
      setMaxPercent(100);
      return;
    }

    if (value <= minPercent) {
      setMaxPercent(minPercent + 1);
      return;
    }

    setMaxPercent(value);
  };

  const minValue = (valueRange * minPercent) / 100;
  const maxValue = (valueRange * maxPercent) / 100;

  return (
    <div style={{ maxWidth: '500px' }}>
      <input type="number" value={minValue} disabled />
      <input type="range" min="0" max="100" value={minPercent} onChange={handleMinPercentChange} />
      <input type="range" min="0" max="100" value={maxPercent} onChange={handleMaxPercentChange} />
      <input type="number" value={maxValue} disabled />
    </div>
  );
};

function getVal(range: number, percent: number) {
  return (range * percent) / 100;
}
