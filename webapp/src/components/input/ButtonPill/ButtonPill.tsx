import './ButtonPill.scss';

import cn from 'classnames';

export type ButtonPillVariant = 'primary' | 'secondary';

interface ButtonPillProps {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  variant?: ButtonPillVariant;
  disabled?: boolean;
}

export const ButtonPill: React.FunctionComponent<ButtonPillProps> = ({ text, onClick, disabled, variant = 'primary' }) => {
  return (
    <button
      className={cn('ButtonPill', `ButtonPill--${variant}`, { 'ButtonPill--disabled': disabled })}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
