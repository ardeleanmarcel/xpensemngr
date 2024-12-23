import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ButtonPill } from './ButtonPill';

const meta = {
  title: 'Base Components/Input/ButtonPill',
  component: ButtonPill,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof ButtonPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {
  args: {
    text: 'click Me',
  },
};
