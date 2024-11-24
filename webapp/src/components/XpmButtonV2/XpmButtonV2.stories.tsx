import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { XpmButtonV2 } from './XpmButtonV2';

const meta = {
  title: 'Base Components/Input/Button',
  component: XpmButtonV2,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof XpmButtonV2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {
  args: {
    text: 'click Me',
  },
};
