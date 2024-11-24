import { cleanObject } from '../../utils/object.utils';
import './XpmInputText.scss';

interface XpmInputTextProps {
  name: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  width?: string;
}

// TODO -> add transition from underline to outline
// TODO -> add disabled state
// TODO -> add color variant for outline colors (green / purple)

export function XpmInputText({
  name,
  value,
  onChange,
  width,
}: React.PropsWithChildren<XpmInputTextProps>) {
  const style = cleanObject({ width });

  return (
    <div className="XpmInputText" style={style}>
      <input type="text" value={value} placeholder={name} onChange={onChange} />
      <fieldset>
        <legend>{name}</legend>
      </fieldset>
    </div>
  );
}

// TODO -> need figma states of all possible input variants:
//   focus-visible, focus, hover, disabled, error, empty (no text), overfull (too much text), etc
