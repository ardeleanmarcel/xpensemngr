import { useState } from 'react';

import { getAllLabels } from '../../api/api.endpoints';
import { CardV2 } from '../../components/layout/CardV2/CardV2';
import { PageHeader } from '../../components/layout/PageHeader/PageHeader';
import { AuthProtected } from '../../components/utils/AuthProtected';
import { XpmPaper } from '../../components/XpmPaper';
import { TableV2Column, XpmTableV2 } from '../../components/XpmTableV2';
import { Modal, useModal } from '../../contexts/modal/modal.context';
import { INTERNAL_EVENT, useInternalEvents } from '../../hooks/useInternalEvents';
import { useRunOnce } from '../../hooks/useRunOnce';

interface LabelData {
  name: string;
  label_id: number;
  added_by_user_id: number;
  description: string | null;
}

const columns: TableV2Column[] = [
  { id: 'label_id', label: 'ID', minWidth: 170, align: 'center', width: '10%' },
  {
    id: 'name',
    label: 'NAME',
    minWidth: 170,
    width: '30%',
    align: 'center',
  },
  {
    id: 'description',
    label: 'DESCRIPTION',
    minWidth: 170,
    width: '60%',
    align: 'center',
  },
] as const;

export const LabelManagement = () => {
  const { subscribeTo } = useInternalEvents();
  const { show } = useModal();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [labels, setLabels] = useState<LabelData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      setLoading(true);
      const labels = await getAllLabels();
      setLabels(labels);
    } catch (error) {
      console.error('Error fetching labels:', error);
    } finally {
      setLoading(false);
    }
  };

  useRunOnce(() => {
    fetchLabels();
    // TODO (Valle) -> need a way to also have the right options passed to the "fetchLabels" execution
    subscribeTo(INTERNAL_EVENT.AddLabelSuccess, fetchLabels);
    subscribeTo(INTERNAL_EVENT.EditLabelSuccess, fetchLabels);
  });

  return (
    <CardV2 minHeight="100%" padding="l" showLoading={loading}>
      <PageHeader title="Label Management" />
      <XpmPaper sx={{ width: '100%' }}>
        <XpmTableV2
          columns={columns}
          rows={labels.map((l) => ({ ...l, key: l.label_id, id: l.label_id }))}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          onEditClick={(data: unknown) => {
            // TODO (Valle) -> data should not be unknown, table types should be improved
            show({ type: Modal.EditLabel, props: { label: data } });
            console.log('Edit label for:', data);
          }}
        />
      </XpmPaper>
    </CardV2>
  );
};

export const ProtectedManageLabels = () => (
  <AuthProtected>
    <LabelManagement />
  </AuthProtected>
);
