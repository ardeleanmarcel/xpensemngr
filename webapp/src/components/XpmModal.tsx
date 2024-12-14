import { Modal } from '@mui/material';
import { ReactNode } from 'react';

type XpmModalProps = {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  ariaLabelledBy: string;
  ariaDescribedBy: string;
};

export const XpmModal = ({
  children,
  open,
  onClose,
  ariaLabelledBy = 'modal-title',
  ariaDescribedBy = 'modal-description',
}: XpmModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      <div>{children}</div>
    </Modal>
  );
};
