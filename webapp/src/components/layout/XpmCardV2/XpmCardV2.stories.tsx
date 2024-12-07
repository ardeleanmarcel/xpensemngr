import type { Meta, StoryObj } from '@storybook/react';

import { XpmCardV2 } from './XpmCardV2';

const meta = {
  title: 'Base Components/Layout/Card',
  component: XpmCardV2,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof XpmCardV2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {
  args: {
    children: 'I am the card content',
  },
};
