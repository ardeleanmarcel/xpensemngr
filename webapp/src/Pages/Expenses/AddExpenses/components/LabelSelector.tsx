import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Label {
  label_id: number;
  name: string;
}

interface LabelSelectorProps {
  labels: Label[];
  selectedLabels: number[];
  onSelectionChange: (labels: number[]) => void;
}

export function LabelSelector({
  labels,
  selectedLabels,
  onSelectionChange,
}: LabelSelectorProps) {
  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;

    if (typeof value === 'string') {
      console.error('Value is not an array');
      return;
    }

    onSelectionChange(value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Labels</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedLabels}
          onChange={handleChange}
          input={<OutlinedInput label="Labels" />}
          renderValue={(selected) =>
            selected
              .map((id) => labels.find((lb) => lb.label_id === id)?.name)
              .join(', ')
          }
          MenuProps={MenuProps}
        >
          {labels.map((lb) => (
            <MenuItem key={lb.label_id} value={lb.label_id}>
              <Checkbox checked={selectedLabels.includes(lb.label_id)} />
              <ListItemText primary={lb.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
