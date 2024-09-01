import { useEffect, useState } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Card, CardContent, TableHead, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { TITLE } from './constants';
import { formatDate, getAllExpenses } from './expensesUtils';

interface Column {
  id: 'description' | 'amount' | 'date_expended_at';
  label: string;
  minWidth?: number;
  align?: 'center';
}

const columns: Column[] = [
  { id: 'description', label: 'Description', minWidth: 170, align: 'center' },
  {
    id: 'amount',
    label: 'Amount',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'date_expended_at',
    label: 'Date',
    minWidth: 170,
    align: 'center',
  },
];

interface Data {
  description: string;
  amount: number;
  date_expended_at: string;
  expense_id: number;
}

function createData(
  expenses: {
    description: string;
    amount: number;
    date_expended_at: string;
    expense_id: number;
  }[]
): Data[] {
  return expenses.map((expense) => ({
    description: expense.description,
    amount: expense.amount,
    date_expended_at: formatDate(expense.date_expended_at),
    expense_id: expense.expense_id,
  }));
}

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
    <Card>
      <CardContent
        sx={{
          textAlign: 'left',
          marginTop: '30px',
        }}
      >
        <div className={classes.container}>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            className={classes.title}
          >
            {TITLE}
          </Typography>
          <Paper sx={{ width: '100%' }}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ top: 57, minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.expense_id}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </CardContent>
    </Card>
  );
};
