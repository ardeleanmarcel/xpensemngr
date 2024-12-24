import './InputText.scss';

import cn from 'classnames';

import { cleanObject } from '../../../utils/object.utils';

export interface InputTextProps {
  name: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  width?: string;
  type?: 'text' | 'password';
  placeholder?: string;
  disabled?: boolean;
  'data-id'?: string;
}

export function InputText({
  name,
  value,
  onChange,
  width,
  placeholder,
  type = 'text',
  disabled = false,
  'data-id': dataId,
}: React.PropsWithChildren<InputTextProps>) {
  const style = cleanObject({ width });
  const inputProps = cleanObject({ 'data-id': dataId });

  return (
    <div className={cn('InputText', { 'InputText--disabled': disabled })} style={style}>
      <input type={type} value={value} placeholder={placeholder ?? name} onChange={onChange} {...inputProps} />
      <fieldset>
        <legend>{name}</legend>
      </fieldset>
    </div>
  );
}
