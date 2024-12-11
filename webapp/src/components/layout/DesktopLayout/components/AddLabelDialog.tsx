import { useState } from 'react';

import { client } from '../../../../api/apiClient';

import { XpmButtonV2 } from '../../../XpmButtonV2/XpmButtonV2';
import { XpmInputText } from '../../../XpmInputText/XpmInputText';
import { XpmText } from '../../../XpmText/XpmText';

import { BasicDialog } from '../../BasicDialog/BasicDialog';
import { XpmHorizontalSeparator } from '../../XpmHorizontalSeparator/XpmHorizontalSeparator';
import { XpmVerticalSpacer } from '../../XpmVerticalSpacer/XpmVerticalSpacer';

interface AddExpenseDialogProps extends React.PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLabelDialog: React.FunctionComponent<AddExpenseDialogProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddLabel = async () => {
    await client.labels.create.mutate([{ name, description: description || undefined }]);

    setName('');
    setDescription('');
  };

  return (
    <BasicDialog isOpen={isOpen} onBackdropClick={onClose} width="680px" height="420px">
      <XpmText content="Add Label" size="m" />
      <XpmVerticalSpacer size="xs" />
      <XpmHorizontalSeparator width="50px" />
      <XpmVerticalSpacer size="m" />
      <XpmInputText name="New Label Name" onChange={(e) => setName(e.target.value)} value={name} />
      <XpmVerticalSpacer size="m" />
      <XpmInputText name="description" onChange={(e) => setDescription(e.target.value)} value={description} />
      <XpmVerticalSpacer size="m" />
      <XpmButtonV2 text="Add" onClick={handleAddLabel} />
    </BasicDialog>
  );
};
