import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { isEqual } from 'lodash';
import { useRef, useState } from 'react';

import { ExpenseGetAllFilterType } from '../../../../../api/src/models/expense.models';
import type { LabelType } from '../../../../../api/src/models/label.models';
import { CardV2 } from '../../../components/layout/CardV2/CardV2';
import { AuthProtected } from '../../../components/utils/AuthProtected';
import { XpmPaper } from '../../../components/XpmPaper';
import { XpmTable } from '../../../components/XpmTable';
import { XpmText } from '../../../components/XpmText/XpmText';
import { INTERNAL_EVENT, useInternalEvents } from '../../../contexts/events/internal.events';
import { useDebounced } from '../../../hooks/useDebounced';
import { useRunOnce } from '../../../hooks/useRunOnce';
import { columns, createData, Data, getAllExpenses, getAllLabels, getHighestAmountExpense } from '../expensesUtils';
import { DashboardFilters, DashboardFiltersDesktop, DEFAULT_FILTERS } from './components/DashboardFiltersDesktop';
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

export const ExpensesDashboard: React.FunctionComponent = () => {
  const classes = useStyles();
  // TODO (Valle) -> only debounce the range change? and have the rest make calls on blur?
  const debounced = useDebounced(1000);
  const { subscribeTo } = useInternalEvents();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Data[]>([]);
  const [labels, setLabels] = useState<Array<LabelType>>([]);
  const [maxAmount, setMaxAmount] = useState(0);

  const lastSearchOptions = useRef<ExpenseGetAllFilterType>();
  const filters = useRef<DashboardFilters>(DEFAULT_FILTERS);

  const fetchLabels = async () => {
    const lbs = await getAllLabels();
    setLabels(lbs);
  };

  const fetchExpenses = async () => {
    try {
      const opts = getSearchOptions(filters.current);

      if (isEqual(lastSearchOptions.current, opts)) {
        return;
      }
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
    // TODO (Valle) -> need a way to also have the right options passed to the "fetchExpenses" execution
    subscribeTo(INTERNAL_EVENT.AddExpenseSuccess, fetchExpenses);
  });

  const handleFilterChange = (f: DashboardFilters) => {
    filters.current = f;

    debounced.run(() => {
      fetchExpenses().then(() => {
        setPage(0);
      });
    });
  };

  // @ts-expect-error "event: unknown"
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <CardV2>
      <div className={classes.container}>
        <XpmText content={TITLE} size="m" />
        <DashboardFiltersDesktop availableLabels={labels} maxAmount={maxAmount} onFilterChange={handleFilterChange} />
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
    </CardV2>
  );
};

export const ProtectedExpensesDashboard = () => (
  <AuthProtected>
    <ExpensesDashboard />
  </AuthProtected>
);

function getSearchOptions(f?: DashboardFilters): ExpenseGetAllFilterType {
  const opts: ExpenseGetAllFilterType = {};

  if (!f) {
    return opts;
  }

  if (f.rangeMax > 0) {
    opts.amount_lte = f.rangeMax;
  }

  if (f.rangeMin > 0) {
    opts.amount_gte = f.rangeMin;
  }

  if (f.selectedLabels.length > 0) {
    opts.label_ids = f.selectedLabels;
  }

  if (f.dateFrom) {
    opts.date_gte = f.dateFrom;
  }

  if (f.dateTo) {
    opts.date_lte = f.dateTo;
  }
  return opts;
}
