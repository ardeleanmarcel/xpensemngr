import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';

import { LabelType } from '../../../../../api/src/models/business.models';
import { ConstrainedRange } from '../../../components/input/ConstrainedRange/ConstrainedRange';
import { LabelSelector } from '../../../components/specialized/LabelSelector';
import { useDebounced } from '../../../hooks/useDebounced';
import { usePrevious } from '../../../hooks/usePrevious';

export interface ExpenseFilters {
  rangeMin: number;
  rangeMax: number;
  dateFrom: string;
  dateTo: string;
  selectedLabels: number[];
}

type FilterUpdate = {
  [K in keyof ExpenseFilters]: [K, ExpenseFilters[K]];
}[keyof ExpenseFilters];

interface ExpenseFiltersDesktopProps {
  onFilterChange: (f: ExpenseFilters) => void;
  availableLabels: Array<LabelType>;
  maxAmount: number;
}

export const DEFAULT_FILTERS = {
  rangeMin: 0,
  rangeMax: 0,
  dateFrom: '',
  dateTo: '',
  selectedLabels: [],
};

export const ExpenseManagementFiltersDesktop: React.FC<ExpenseFiltersDesktopProps> = ({
  availableLabels,
  maxAmount,
  onFilterChange,
}) => {
  const debounced = useDebounced(500);

  const [filters, setFilters] = useState<ExpenseFilters>(DEFAULT_FILTERS);
  const [selectedLabels, setSelectedLabels] = useState<Array<number>>([]);

  const previousFilters = usePrevious(filters);

  useEffect(() => {
    if (!isEqual(previousFilters, filters)) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange, previousFilters]);

  const updateFilters = (updates: Array<FilterUpdate>) => {
    setFilters((f) => {
      const newFilters: ExpenseFilters = { ...f };

      updates.forEach(([filter, value]) => {
        // TODO (Valle) -> i don't like using "as never" here. Find an improved solution
        newFilters[filter] = value as never;
      });

      return newFilters;
    });
  };

  const handleLabelSelection = (sl: number[]) => {
    setSelectedLabels(sl);
  };

  const handleLableSelectionClose = () => {
    updateFilters([['selectedLabels', selectedLabels]]);
  };

  const handleRangeChange = (min: number, max: number) => {
    debounced.run(() =>
      updateFilters([
        ['rangeMin', min],
        ['rangeMax', max],
      ])
    );
  };

  return (
    <>
      <div>
        <label htmlFor="date-from">From:&nbsp;</label>
        <input
          id="date-from"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => updateFilters([['dateFrom', e.target.value]])}
        />
        <div style={{ width: '40px', display: 'inline-block' }} />
        <label htmlFor="date-to">To:&nbsp;</label>
        <input id="date-to" type="date" value={filters.dateTo} onChange={(e) => updateFilters([['dateTo', e.target.value]])} />
      </div>
      <LabelSelector
        labels={availableLabels}
        onSelectionChange={handleLabelSelection}
        selectedLabels={selectedLabels}
        onClose={handleLableSelectionClose}
      />
      <ConstrainedRange min={0} max={maxAmount} onChange={handleRangeChange} />
    </>
  );
};
