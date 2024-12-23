import './InputText.scss';

import { cleanObject } from '../../../utils/object.utils';

export interface InputTextProps {
  name: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  width?: string;
  type?: 'text' | 'password';
  placeholder?: string;
}

// TODO -> add transition from underline to outline
// TODO -> add disabled state
// TODO -> add color variant for outline colors (green / purple)

export function InputText({ name, value, onChange, width, type = 'text', placeholder }: React.PropsWithChildren<InputTextProps>) {
  const style = cleanObject({ width });

  return (
    <div className="InputText" style={style}>
      <input type={type} value={value} placeholder={placeholder ?? name} onChange={onChange} />
      <fieldset>
        <legend>{name}</legend>
      </fieldset>
    </div>
  );
}

// TODO -> need figma states of all possible input variants:
//   focus-visible, focus, hover, disabled, error, empty (no text), overfull (too much text), etc
