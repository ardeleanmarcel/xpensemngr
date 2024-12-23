import './XpmLinkButton.scss';

import cn from 'classnames';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface XpmLinkButtonProps {
  text: string;
  to?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  size?: 'xs' | 's' | 'sm' | 'm';
  showUnderline?: boolean;
}
export function XpmLinkButton({
  text,
  to,
  onClick,
  size = 'sm',
  showUnderline = true,
}: React.PropsWithChildren<XpmLinkButtonProps>) {
  const navigate = useNavigate();

  useEffect(() => {
    if (to && onClick) {
      console.warn('XpmLinkButton: Both "to" and "onClick" props are provided. This is allowed but not recommended.');
    }

    if (!to && !onClick) {
      console.error('XpmLinkButton: Either "to" or "onClick" prop is required for this component to work.');
    }
  }, [to, onClick]);

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (to) navigate(to);
    if (onClick) onClick(e);
  };

  const classes = cn('XpmLinkButton', `XpmLinkButton--${size}`, { 'XpmLinkButton--underline': showUnderline });

  return (
    <a className={classes} href={to} onClick={handleClick}>
      {text}
    </a>
  );
}
