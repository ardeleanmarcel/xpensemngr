import { Button, ButtonProps, SxProps } from '@mui/material';

type XpmButtonProps = {
  size?: 'small' | 'medium' | 'large';
  buttonName: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (...args: unknown[]) => void;
  variant?: 'text' | 'contained' | 'outlined';
  color?: ButtonProps['color'];
  fullWidth?: boolean;
  sx?: SxProps;
  nameInLowercase?: boolean;
};

export const XpmButton = ({
  size = 'small',
  buttonName,
  disabled = false,
  type = 'button',
  onClick,
  variant = 'contained',
  color = 'primary',
  fullWidth = false,
  sx,
  nameInLowercase = false,
}: XpmButtonProps) => {
  return (
    <Button
      size={size}
      type={type}
      variant={variant}
      color={color}
      sx={{
        textTransform: nameInLowercase ? 'none' : 'inherit',
        ...sx,
      }}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
    >
      {buttonName}
    </Button>
  );
};
