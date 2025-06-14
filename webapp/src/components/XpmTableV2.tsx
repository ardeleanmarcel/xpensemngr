import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

export interface TableV2Column {
  id: string;
  label: string;
  minWidth?: number;
  width?: `${number}%`;
  align?: 'left' | 'center' | 'right';
}

interface Row {
  key: string | number;
  [key: string]: unknown;
}

type XpmTableProps = {
  columns: TableV2Column[];
  rows: Row[];
  rowsPerPage: number;
  page: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const tableRowStyle = {
  '& .MuiTableRow-root': {
    height: '52px',
    maxHeight: '52px',
  },
  '& .MuiTableCell-root': {
    padding: '4px 16px',
    height: '52px',
    maxHeight: '52px',
  },
};

export const XpmTableV2 = ({ columns, rows, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage }: XpmTableProps) => {
  const computedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
    return (
      <TableRow key={row.key} style={{ height: 24 }}>
        {columns.map((column) => {
          const value = row[column.id] as React.ReactNode;

          return (
            <TableCell key={column.id} align={column.align}>
              {value || '-'}
            </TableCell>
          );
        })}
      </TableRow>
    );
  });

  if (computedRows.length < 10) {
    const emptyRows = 10 - computedRows.length;
    for (let i = 0; i < emptyRows; i++) {
      computedRows.push(
        <TableRow key={`empty-row-${i}`} style={{ height: 24 }}>
          <TableCell colSpan={columns.length} />
        </TableRow>
      );
    }
  }

  return (
    <>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table" sx={tableRowStyle}>
          <TableHead>
            <TableRow style={{ height: 24 }}>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, width: column.width }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{computedRows}</TableBody>
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
    </>
  );
};
