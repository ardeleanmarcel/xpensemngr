import { Button, ButtonProps, SxProps } from '@mui/material';

type XpmButtonProps = {
  size?: 'small' | 'medium' | 'large';
  buttonName?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  variant?: 'text' | 'contained' | 'outlined';
  color?: ButtonProps['color'];
  fullWidth?: boolean;
  sx?: SxProps;
};

export const XpmButton = ({
  size = 'small',
  buttonName = 'ButtonName',
  disabled = false,
  type = 'button',
  onClick = () => {},
  variant = 'contained',
  color = 'primary',
  fullWidth = false,
  sx,
}: XpmButtonProps) => {
  return (
    <Button
      size={size}
      type={type}
      variant={variant}
      color={color}
      sx={sx}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
    >
      {buttonName}
    </Button>
  );
};
