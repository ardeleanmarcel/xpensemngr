import { useEffect, useState } from 'react';

import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { XpmTypography } from '../../../components/XpmTypography';
import { XpmTable } from '../../../components/XpmTable';
import { TITLE } from './constants';
import { columns, createData, Data, getAllExpenses } from './expensesUtils';
import { XpmCard } from '../../../components/XpmCard';
import { XpmCardContent } from '../../../components/XpmCardContent';
import { XpmPaper } from '../../../components/XpmPaper';

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expenses = await getAllExpenses();
        const processedData = createData(expenses);
        setRows(processedData);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <XpmCard>
      <XpmCardContent
        sx={{
          textAlign: 'left',
          marginTop: '30px',
        }}
      >
        <div className={classes.container}>
          <XpmTypography
            variant="h4"
            component="h2"
            align="center"
            className={classes.title}
            text={TITLE}
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
