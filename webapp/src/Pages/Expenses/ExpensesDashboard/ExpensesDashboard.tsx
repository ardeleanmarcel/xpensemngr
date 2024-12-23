import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { isEqual } from 'lodash';
import { useEffect, useRef, useState } from 'react';

import { ExpenseGetAllFilterType } from '../../../../../api/src/models/expense.models';
import type { LabelType } from '../../../../../api/src/models/label.models';
import { ConstrainedRange } from '../../../components/input/ConstrainedRange/ConstrainedRange';
import { LabelSelector } from '../../../components/specialized/LabelSelector';
import { AuthProtected } from '../../../components/utils/AuthProtected';
import { XpmCard } from '../../../components/XpmCard';
import { XpmCardContent } from '../../../components/XpmCardContent';
import { XpmPaper } from '../../../components/XpmPaper';
import { XpmTable } from '../../../components/XpmTable';
import { XpmTypography } from '../../../components/XpmTypography';
import { useDebounced } from '../../../hooks/useDebounced';
import { useRunOnce } from '../../../hooks/useRunOnce';
import { columns, createData, Data, getAllExpenses, getAllLabels, getHighestAmountExpense } from '../expensesUtils';
import { TITLE } from './constants';

const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'grid',
    gap: '50px',
  },
  title: {
    color: theme.palette.text.primary,
    marginTop: '40px !important',
    //TODO -> remove '!important'
  },
  actionText: {
    display: 'flex',
    justifyContent: 'center',
    color: theme.palette.text.primary,
  },
}));

interface DashboardFilters {
  dateFrom: string;
  dateTo: string;
}

const DEFAULT_FILTERS = {
  dateFrom: '',
  dateTo: '',
};

export const ExpensesDashboard: React.FunctionComponent = () => {
  const classes = useStyles();
  // TODO (Valle) -> only debounce the range change? and have the rest make calls on blur?
  const debounced = useDebounced(1000);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Data[]>([]);
  const [labels, setLabels] = useState<Array<LabelType>>([]);
  const [selectedLabels, setSelectedLabels] = useState<Array<number>>([]);
  const [maxAmount, setMaxAmount] = useState(0);
  const [selectedRange, setSelectedRange] = useState({ min: 0, max: 1000 });
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);

  const lastSearchOptions = useRef<ExpenseGetAllFilterType>();

  const fetchLabels = async () => {
    const lbs = await getAllLabels();
    setLabels(lbs);
  };

  const fetchExpenses = async () => {
    try {
      const opts = getSearchOptions();

      lastSearchOptions.current = opts;

      const expenses = await getAllExpenses(opts);
      const processedData = createData(expenses);
      setRows(processedData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchHighestAmountExpense = async () => {
    const expense = await getHighestAmountExpense();

    const max = expense && expense.length > 0 ? expense[0].amount : 1000;
    setMaxAmount(max);
  };

  useRunOnce(() => {
    fetchExpenses();
    fetchLabels();
    fetchHighestAmountExpense();
  });

  useEffect(() => {
    const opts = getSearchOptions();

    if (isEqual(lastSearchOptions.current, opts)) {
      return;
    }

    debounced.run(() => {
      fetchExpenses();
    });
  }, [selectedRange, selectedLabels, filters]);

  const getSearchOptions = (): ExpenseGetAllFilterType => {
    const opts: ExpenseGetAllFilterType = {};

    if (selectedRange.max > 0) {
      opts.amount_lte = selectedRange.max;
    }

    if (selectedLabels.length > 0) {
      opts.label_ids = selectedLabels;
    }

    if (selectedRange.min > 0) {
      opts.amount_gte = selectedRange.min;
    }

    if (selectedLabels.length > 0) {
      opts.label_ids = selectedLabels;
    }

    if (filters.dateFrom) {
      opts.date_gte = filters.dateFrom;
    }

    if (filters.dateTo) {
      opts.date_lte = filters.dateTo;
    }
    return opts;
  };

  const handleLabelSelection = (sl: number[]) => {
    setSelectedLabels(sl);
  };

  const handleLableSelectionClose = () => {
    const newOptions = getSearchOptions();

    if (!isEqual(lastSearchOptions.current, newOptions)) {
      fetchExpenses();
    }
  };

  // @ts-expect-error "event: unknown"
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRangeChange = (min: number, max: number) => {
    setSelectedRange({ min, max });
  };

  return (
    <XpmCard>
      <XpmCardContent
        sx={{
          textAlign: 'left',
          marginTop: '30px',
        }}
      >
        <div className={classes.container}>
          <XpmTypography variant="h4" component="h2" align="center" className={classes.title} text={TITLE} />
          <div>
            <label htmlFor="date-from">From:&nbsp;</label>
            <input
              id="date-from"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
            />
            <div style={{ width: '40px', display: 'inline-block' }} />
            <label htmlFor="date-to">To:&nbsp;</label>
            <input
              id="date-to"
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
            />
          </div>
          <LabelSelector
            labels={labels}
            onSelectionChange={handleLabelSelection}
            selectedLabels={selectedLabels}
            onClose={handleLableSelectionClose}
          />
          <ConstrainedRange min={0} max={maxAmount} onChange={handleRangeChange} />
          <XpmPaper sx={{ width: '100%' }}>
            <XpmTable
              columns={columns}
              rows={rows}
              rowsPerPage={rowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </XpmPaper>
        </div>
      </XpmCardContent>
    </XpmCard>
  );
};

export const ProtectedExpensesDashboard = () => (
  <AuthProtected>
    <ExpensesDashboard />
  </AuthProtected>
);
