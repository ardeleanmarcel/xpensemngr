import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';

import { AuthProtected } from '../../../components/utils/AuthProtected';
import { XpmCard } from '../../../components/XpmCard';
import { XpmCardContent } from '../../../components/XpmCardContent';
import { XpmPaper } from '../../../components/XpmPaper';
import { ColumnTableV2, XpmTableV2 } from '../../../components/XpmTableV2';
import { XpmTypography } from '../../../components/XpmTypography';
import { getAllLabels } from '../expensesUtils';

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

interface LabelData {
  name: string;
  label_id: number;
  added_by_user_id: number;
  description?: string;
}

const columns: ColumnTableV2[] = [
  { id: 'label_id', label: 'ID', minWidth: 170, align: 'center' },
  {
    id: 'name',
    label: 'NAME',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'description',
    label: 'DESCRIPTION',
    minWidth: 170,
    align: 'center',
  },
] as const;

export const ManageLabels = () => {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [labels, setLabels] = useState<LabelData[]>([]);

  // @ts-expect-error "event: unknown"
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchLabels = async () => {
    try {
      const labels = await getAllLabels();
      setLabels(labels);
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  };

  useEffect(() => {
    fetchLabels();
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
          <XpmTypography variant="h4" component="h2" align="center" className={classes.title} text="LABELURI" />

          <XpmPaper sx={{ width: '100%' }}>
            <XpmTableV2
              columns={columns}
              rows={labels.map((l) => ({ ...l, key: l.label_id }))}
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

export const ProtectedManageLabels = () => (
  <AuthProtected>
    <ManageLabels />
  </AuthProtected>
);
