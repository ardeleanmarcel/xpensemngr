import { useState } from 'react';

import { client } from '../../../api/apiClient';
import { ButtonPill } from '../../input/ButtonPill/ButtonPill';
import { InputText } from '../../input/InputText/InputText';
import { BasicDialog } from '../../layout/BasicDialog/BasicDialog';
import { XpmHorizontalSeparator } from '../../layout/XpmHorizontalSeparator/XpmHorizontalSeparator';
import { XpmVerticalSpacer } from '../../layout/XpmVerticalSpacer/XpmVerticalSpacer';
import { XpmText } from '../../XpmText/XpmText';

interface AddExpenseDialogProps extends React.PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLabelDialog: React.FunctionComponent<AddExpenseDialogProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddLabel = async () => {
    await client.expenses.labels.create.mutate([{ name, description: description || undefined }]);

    setName('');
    setDescription('');
  };

  return (
    <BasicDialog isOpen={isOpen} onBackdropClick={onClose} width="680px" height="420px">
      <XpmText content="Add Label" size="m" />
      <XpmVerticalSpacer size="xs" />
      <XpmHorizontalSeparator width="50px" />
      <XpmVerticalSpacer size="m" />
      <InputText name="New Label Name" onChange={(e) => setName(e.target.value)} value={name} />
      <XpmVerticalSpacer size="m" />
      <InputText name="description" onChange={(e) => setDescription(e.target.value)} value={description} />
      <XpmVerticalSpacer size="m" />
      <ButtonPill text="Add" onClick={handleAddLabel} />
    </BasicDialog>
  );
};
