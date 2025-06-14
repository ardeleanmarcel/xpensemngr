import './ExpenseManagement.scss';

import { useRef, useState } from 'react';

import { ExpenseGetAllFilterType } from '../../../../api/src/domains/expenses/expense.models';
import type { LabelType } from '../../../../api/src/models/business.models';
import { getAllLabels } from '../../api/api.endpoints';
import { CardV2 } from '../../components/layout/CardV2/CardV2';
import { PageHeader } from '../../components/layout/PageHeader/PageHeader';
import { AuthProtected } from '../../components/utils/AuthProtected';
import { XpmPaper } from '../../components/XpmPaper';
import { XpmTable } from '../../components/XpmTable';
import { INTERNAL_EVENT, useInternalEvents } from '../../hooks/useInternalEvents';
import { useRunOnce } from '../../hooks/useRunOnce';
import { DEFAULT_FILTERS, ExpenseFilters, ExpenseManagementFiltersDesktop } from './components/ExpenseFiltersDesktop';
import { TITLE } from './constants';
import { columns, createData, Data, getAllExpenses, getHighestAmountExpense } from './expenseManagement.utils';

export const ExpenseManagement: React.FunctionComponent = () => {
  const { subscribeTo } = useInternalEvents();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Data[]>([]);
  const [labels, setLabels] = useState<Array<LabelType>>([]);
  const [maxAmount, setMaxAmount] = useState(0);
  const [loading, setLoading] = useState({ expenses: true, labels: true, maxAmount: true });

  const filters = useRef<ExpenseFilters>(DEFAULT_FILTERS);

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

  const handleFilterChange = (f: ExpenseFilters) => {
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
    <CardV2 padding="l" minHeight="100%" showLoading={loading.expenses || loading.labels || loading.maxAmount}>
      <PageHeader
        title={TITLE}
        filters={
          <ExpenseManagementFiltersDesktop availableLabels={labels} maxAmount={maxAmount} onFilterChange={handleFilterChange} />
        }
      />
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
    </CardV2>
  );
};

export const ProtectedExpenseManagement = () => (
  <AuthProtected>
    <ExpenseManagement />
  </AuthProtected>
);

function getSearchOptions(f?: ExpenseFilters): ExpenseGetAllFilterType {
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
