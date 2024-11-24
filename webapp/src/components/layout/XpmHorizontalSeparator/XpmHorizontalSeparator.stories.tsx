import type { Meta, StoryObj } from '@storybook/react';

import { XpmHorizontalSeparator } from './XpmHorizontalSeparator';

const meta = {
  title: 'Base Components/Layout/HorizontalSeparator',
  component: XpmHorizontalSeparator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof XpmHorizontalSeparator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {
  args: {
    width: '50px',
  },
};
