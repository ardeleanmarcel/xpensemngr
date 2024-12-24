import { useEffect, useState } from 'react';

import { client } from '../../../../api/apiClient';
import { getAllLabels, getCurrentDate } from '../../../../Pages/Expenses/expensesUtils';
import { ButtonPill } from '../../../input/ButtonPill/ButtonPill';
import { InputText } from '../../../input/InputText/InputText';
import { LabelSelector } from '../../../specialized/LabelSelector';
import { XpmText } from '../../../XpmText/XpmText';
import { BasicDialog } from '../../BasicDialog/BasicDialog';
import { XpmHorizontalSeparator } from '../../XpmHorizontalSeparator/XpmHorizontalSeparator';
import { XpmVerticalSpacer } from '../../XpmVerticalSpacer/XpmVerticalSpacer';

interface AddExpenseDialogProps extends React.PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseDialog: React.FunctionComponent<AddExpenseDialogProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<Array<number>>([]);

  const [labels, setLabels] = useState<
    {
      name: string;
      label_id: number;
      added_by_user_id: string;
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

  const handleAddExpense: React.MouseEventHandler<HTMLButtonElement> = async () => {
    console.log('attempting to add expense');

    await client.expenses.create.mutate([
      {
        description,
        amount: Number(amount),
        date_expended_at: getCurrentDate(),
        label_ids: selectedLabels,
      },
    ]);
  };

  const handleLabelSelection = (sl: number[]) => {
    setSelectedLabels(sl);
  };

  const focusFirstInput = () => {
    console.log('bip');
    const el = document.querySelector('[data-id="amount"]');
    console.log('el', el);
    if (el && el instanceof HTMLInputElement) el.focus();
  };

  return (
    <BasicDialog isOpen={isOpen} onBackdropClick={onClose} width="680px" height="420px" onAfterOpen={focusFirstInput}>
      <XpmText content="Add Expense" size="m" />
      <XpmVerticalSpacer size="xs" />
      <XpmHorizontalSeparator width="50px" />
      <XpmVerticalSpacer size="m" />
      <InputText data-id="amount" name="amount" onChange={(e) => setAmount(e.target.value)} value={amount} />
      <XpmVerticalSpacer size="m" />
      <InputText name="description" onChange={(e) => setDescription(e.target.value)} value={description} />
      <XpmVerticalSpacer size="m" />
      <LabelSelector labels={labels} onSelectionChange={handleLabelSelection} selectedLabels={selectedLabels} />
      <XpmVerticalSpacer size="m" />
      <ButtonPill text="Add" onClick={handleAddExpense} />
    </BasicDialog>
  );
};
