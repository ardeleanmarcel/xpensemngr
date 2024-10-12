import { useState } from 'react';
import { XpmButton } from '../../../../components/XpmButton';
import { XpmTextField } from '../../../../components/XpmTextField';
import { client } from '../../../../api/apiClient';

export const AddLabel = ({ onAddEnd }: { onAddEnd?: () => void }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    await client.labels.create.mutate([
      { name, description: description || undefined },
    ]);

    setName('');
    setDescription('');

    onAddEnd?.();
  };

  return (
    <>
      <XpmTextField
        name="New Label Name"
        label="New Label Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <XpmTextField
        name="Description"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <XpmButton onClick={handleAdd} buttonName="ADD" />
    </>
  );
};
