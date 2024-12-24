import './ButtonPill.scss';

import cn from 'classnames';

interface XpmButtonV2Props {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export const ButtonPill: React.FunctionComponent<XpmButtonV2Props> = ({ text, onClick, disabled }) => {
  return (
    <button className={cn('ButtonPill', { 'ButtonPill--disabled': disabled })} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};
