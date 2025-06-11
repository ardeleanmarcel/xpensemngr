import './MainDashboard.scss';

import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useRef, useState } from 'react';

import { ExpenseGetAllFilterType } from '../../../../api/src/domains/expenses/expense.models';
import type { LabelType } from '../../../../api/src/models/business.models';
import { getAllLabels } from '../../api/api.endpoints';
import { FilterFunnel } from '../../components/icons/FilterFunnel/FilterFunnel';
import { XpmLoadingSpinner } from '../../components/info/XpmLoadingSpinner/XpmLoadingSpinner';
import { CardV2 } from '../../components/layout/CardV2/CardV2';
import { AuthProtected } from '../../components/utils/AuthProtected';
import { XpmPaper } from '../../components/XpmPaper';
import { XpmTable } from '../../components/XpmTable';
import { XpmText } from '../../components/XpmText/XpmText';
import { SCREEN_SIZE } from '../../constants/screenSize';
import { INTERNAL_EVENT, useInternalEvents } from '../../contexts/events/internal.events';
import { useRunOnce } from '../../hooks/useRunOnce';
import { useScreenSize } from '../../hooks/useScreenSize';
import { DashboardFilters, DashboardFiltersDesktop, DEFAULT_FILTERS } from './components/DashboardFiltersDesktop';
import { TITLE } from './constants';
import { columns, createData, Data, getAllExpenses, getHighestAmountExpense } from './utils';

const useStyles = makeStyles<Theme>((theme) => ({
  container: {
    display: 'grid',
    gap: '20px',
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

export const MainDashboard: React.FunctionComponent = () => {
  const classes = useStyles();
  const { subscribeTo } = useInternalEvents();
  const { screenSize } = useScreenSize();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Data[]>([]);
  const [labels, setLabels] = useState<Array<LabelType>>([]);
  const [maxAmount, setMaxAmount] = useState(0);
  const [loading, setLoading] = useState({ expenses: true, labels: true, maxAmount: true });

  const filters = useRef<DashboardFilters>(DEFAULT_FILTERS);

  const updateLoading = (type: 'expenses' | 'labels' | 'maxAmount', value: boolean) => {
    setLoading((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const fetchLabels = async () => {
    const lbs = await getAllLabels();
    setLabels(lbs);
    updateLoading('labels', false);
  };

  const fetchExpenses = async () => {
    try {
      const opts = getSearchOptions(filters.current);
      const expenses = await getAllExpenses(opts);
      const processedData = createData(expenses);
      setRows(processedData);
      updateLoading('expenses', false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchHighestAmountExpense = async () => {
    const expense = await getHighestAmountExpense();

    const max = expense && expense.length > 0 ? expense[0].amount : 1000;
    setMaxAmount(max);
    updateLoading('maxAmount', false);
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

    fetchExpenses().then(() => {
      setPage(0);
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
      <XpmLoadingSpinner isVisible={loading.expenses || loading.labels || loading.maxAmount} fullscreen />
      <div className={classes.container}>
        <div className="MainDashboard--title-container">
          <XpmText content={TITLE} size="m" />
          {screenSize !== SCREEN_SIZE.Desktop && <FilterFunnel />}
        </div>
        {screenSize === SCREEN_SIZE.Desktop && (
          <DashboardFiltersDesktop availableLabels={labels} maxAmount={maxAmount} onFilterChange={handleFilterChange} />
        )}
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
    <MainDashboard />
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
