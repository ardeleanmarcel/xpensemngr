import { useState } from 'react';

import { client } from '../../../api/apiClient';
import { INTERNAL_EVENT, useInternalEvents } from '../../../hooks/useInternalEvents';
import { XpmLoadingSpinner } from '../../info/XpmLoadingSpinner/XpmLoadingSpinner';
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
  const { emitEvent } = useInternalEvents();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddLabel = async () => {
    try {
      setIsSaving(true);
      await client.expenses.labels.create.mutate([{ name, description: description || null }]);

      setName('');
      setDescription('');
      emitEvent(INTERNAL_EVENT.AddLabelSuccess);
      onClose();
    } catch (error) {
      console.error('Error adding label:', error);
      // Handle error, e.g., show a notification
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BasicDialog isOpen={isOpen} onBackdropClick={onClose} width="680px" height="420px">
      <XpmLoadingSpinner isVisible={isSaving} />
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
