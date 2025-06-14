import './ButtonPill.scss';

import cn from 'classnames';

import { IconComponent } from '../../icons/MoneyBills/MoneyBills';

export type ButtonPillVariant = 'primary' | 'secondary';

interface ButtonPillProps {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  variant?: ButtonPillVariant;
  disabled?: boolean;
  Icon?: IconComponent;
  contentAlignment?: 'left' | 'center' | 'right';
}

export const ButtonPill: React.FunctionComponent<ButtonPillProps> = ({
  text,
  onClick,
  disabled,
  variant = 'primary',
  Icon,
  contentAlignment = 'center',
}) => {
  const classes = cn('ButtonPill', `ButtonPill--${variant}`, `ButtonPill--content-alignment--${contentAlignment}`, {
    'ButtonPill--disabled': disabled,
    'ButtonPill--with-icon': !!Icon,
  });

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {Icon && <Icon style={getIconStyle(Icon)} className="ButtonPill--icon" />}
      {text}
    </button>
  );
};

const getIconStyle = (Icon: IconComponent): React.CSSProperties => {
  const stl: React.CSSProperties = {
    width: '20px',
    height: '20px',
  };

  if (Icon.name === 'MoneyBills') {
    stl.height = '18px';
    stl.paddingTop = '2px';
  }

  return stl;
};
