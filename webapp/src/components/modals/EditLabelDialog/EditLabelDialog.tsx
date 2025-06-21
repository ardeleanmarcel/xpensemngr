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

export interface EditLabelDialogProps extends React.PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  label: {
    label_id: number;
    name: string;
    description: string | null;
  };
}

export const EditLabelDialog: React.FunctionComponent<EditLabelDialogProps> = ({ isOpen, onClose, label }) => {
  const { emitEvent } = useInternalEvents();

  const [name, setName] = useState(label.name);
  const [description, setDescription] = useState(label.description || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveLabel = async () => {
    try {
      setIsSaving(true);
      await client.expenses.labels.update.mutate([
        {
          label_id: label.label_id,
          name,
          description: description || null,
        },
      ]);

      setName('');
      setDescription('');
      emitEvent(INTERNAL_EVENT.EditLabelSuccess);
      onClose();
    } catch (error) {
      console.error('Error editing label:', error);
      // Handle error, e.g., show a notification
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BasicDialog isOpen={isOpen} onBackdropClick={onClose} width="680px" height="420px">
      <XpmLoadingSpinner isVisible={isSaving} />
      <XpmText content="Edit Label" size="m" />
      <XpmVerticalSpacer size="xs" />
      <XpmHorizontalSeparator width="50px" />
      <XpmVerticalSpacer size="m" />
      <InputText name="New Label Name" onChange={(e) => setName(e.target.value)} value={name} />
      <XpmVerticalSpacer size="m" />
      <InputText name="description" onChange={(e) => setDescription(e.target.value)} value={description} />
      <XpmVerticalSpacer size="m" />
      <ButtonPill text="Save" onClick={handleSaveLabel} />
    </BasicDialog>
  );
};
