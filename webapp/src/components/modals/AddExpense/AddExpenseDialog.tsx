import { useCallback, useEffect, useState } from 'react';

import { getAllLabels } from '../../../api/api.endpoints';
import { client } from '../../../api/apiClient';
import { SnackbarType, useNotification } from '../../../contexts/notification/notification.context';
import { INTERNAL_EVENT, useInternalEvents } from '../../../hooks/useInternalEvents';
import { getCurrentDate } from '../../../Pages/ExpenseManagement/expenseManagement.utils';
import { ButtonPill } from '../../input/ButtonPill/ButtonPill';
import { InputText } from '../../input/InputText/InputText';
import { BasicDialog } from '../../layout/BasicDialog/BasicDialog';
import { XpmHorizontalSeparator } from '../../layout/XpmHorizontalSeparator/XpmHorizontalSeparator';
import { XpmVerticalSpacer } from '../../layout/XpmVerticalSpacer/XpmVerticalSpacer';
import { LabelSelector } from '../../specialized/LabelSelector';
import { XpmText } from '../../XpmText/XpmText';

interface AddExpenseDialogProps extends React.PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseDialog: React.FunctionComponent<AddExpenseDialogProps> = ({ isOpen, onClose }) => {
  const { displaySnackbar } = useNotification();
  const { emitEvent } = useInternalEvents();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<Array<number>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [labels, setLabels] = useState<
    {
      name: string;
      label_id: number;
      added_by_user_id: number;
      description?: string;
    }[]
  >([]);

  const getLabels = async () => {
    const lbs = await getAllLabels();
    setLabels(lbs);
  };

  useEffect(() => {
    getLabels();
  }, []);

  const handleAddExpenseSuccess = () => {
    setAmount('');
    setDescription('');
    setSelectedLabels([]);
    emitEvent(INTERNAL_EVENT.AddExpenseSuccess);
    onClose();
  };

  const handleAddExpense: React.MouseEventHandler<HTMLButtonElement> = () => {
    setIsLoading(true);

    client.expenses.create
      .mutate([
        {
          description,
          amount: Number(amount),
          date_expended_at: getCurrentDate(),
          label_ids: selectedLabels,
        },
      ])
      .then(handleAddExpenseSuccess)
      .catch(() => {
        displaySnackbar({ message: 'Failed to add expense', type: SnackbarType.Error });
      })
      .finally(() => setIsLoading(false));
  };

  const handleLabelSelection = (sl: number[]) => {
    setSelectedLabels(sl);
  };

  const focusFirstInput = useCallback(() => {
    const el = document.querySelector('[data-id="amount"]');
    if (el && el instanceof HTMLInputElement) el.focus();
  }, []);

  const handleDialogBackdropClick = () => {
    if (!isLoading) onClose();
  };

  return (
    <BasicDialog
      isOpen={isOpen}
      onBackdropClick={handleDialogBackdropClick}
      width="680px"
      height="420px"
      onAfterOpen={focusFirstInput}
      showLoading={isLoading}
    >
      <XpmText content="Add Expense" size="m" />
      <XpmVerticalSpacer size="xs" />
      <XpmHorizontalSeparator width="50px" />
      <XpmVerticalSpacer size="m" />
      <InputText data-id="amount" name="amount" onChange={(e) => setAmount(e.target.value)} value={amount} disabled={isLoading} />
      <XpmVerticalSpacer size="m" />
      <InputText
        data-id="description"
        name="description"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        disabled={isLoading}
      />
      <XpmVerticalSpacer size="m" />
      <LabelSelector labels={labels} onSelectionChange={handleLabelSelection} selectedLabels={selectedLabels} />
      <XpmVerticalSpacer size="m" />
      <ButtonPill text="Add" onClick={handleAddExpense} disabled={isLoading} />
    </BasicDialog>
  );
};
