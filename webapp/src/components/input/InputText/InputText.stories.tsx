import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { InputText, InputTextProps } from './InputText';

const TemplateInputText = (args: React.PropsWithChildren<InputTextProps>) => {
  const { value: propValue, ...rest } = args;
  const [value, setValue] = useState(propValue);

  return <InputText value={value} onChange={(e) => setValue(e.target.value)} {...rest} />;
};

const meta = {
  title: 'Base Components/Input/InputText',
  component: TemplateInputText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TemplateInputText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {
  args: {
    value: 'abracadabra',
    name: 'Username',
    placeholder: 'Enter username...',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    value: 'neverguessme',
    name: 'Password',
    placeholder: 'Enter password...',
  },
};
