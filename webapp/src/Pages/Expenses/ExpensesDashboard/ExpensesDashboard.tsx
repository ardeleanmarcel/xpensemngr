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
import { columns, createData, Data, getAllExpenses, getAllLabels } from '../expensesUtils';
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

export const ExpensesDashboard = () => {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Data[]>([]);
  const [labels, setLabels] = useState<Array<LabelType>>([]);
  const [selectedLabels, setSelectedLabels] = useState<Array<number>>([]);

  const lastSearchOptions = useRef<ExpenseGetAllFilterType>();

  const getLabels = async () => {
    const lbs = await getAllLabels();
    setLabels(lbs);
  };

  const fetchExpenses = async () => {
    try {
      const opts: ExpenseGetAllFilterType = {};
      if (selectedLabels.length > 0) {
        opts.label_ids = selectedLabels;
      }

      lastSearchOptions.current = opts;

      const expenses = await getAllExpenses(opts);
      const processedData = createData(expenses);
      setRows(processedData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  // TODO (Valle) -> replace with useRunOnce
  useEffect(() => {
    fetchExpenses();
    getLabels();
  }, []);

  const getSearchOptions = (): ExpenseGetAllFilterType => {
    const opts: ExpenseGetAllFilterType = {};
    if (selectedLabels.length > 0) {
      opts.label_ids = selectedLabels;
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
          <LabelSelector
            labels={labels}
            onSelectionChange={handleLabelSelection}
            selectedLabels={selectedLabels}
            onClose={handleLableSelectionClose}
          />
          <ConstrainedRange
            min={0}
            max={1000}
            onChange={() => {
              console.log('changed');
            }}
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
