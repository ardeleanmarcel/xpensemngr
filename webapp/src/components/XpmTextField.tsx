import { SxProps, TextField, TextFieldVariants } from '@mui/material';

type XpmTextFieldProps = {
  name: string;
  required?: boolean;
  id?: string;
  variant?: TextFieldVariants;
  color?:
    | 'error'
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'inputsColor';
  label: string;
  type?:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'date'
    | 'checkbox'
    | 'radio';
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  value: string;
  disabled?: boolean;
  sx?: SxProps;
  fullWidth?: boolean;
};

export const XpmTextField = ({
  name,
  color = 'inputsColor',
  required = false,
  id,
  label,
  variant = 'outlined',
  type = 'text',
  onChange,
  value,
  disabled = false,
  sx,
  fullWidth = false,
}: XpmTextFieldProps) => {
  return (
    <TextField
      name={name}
      color={color}
      variant={variant}
      required={required}
      id={id}
      label={label}
      type={type}
      onChange={onChange}
      value={value}
      disabled={disabled}
      sx={sx}
      fullWidth={fullWidth}
    />
  );
};
