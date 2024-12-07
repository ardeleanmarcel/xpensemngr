import type { Meta, StoryObj } from '@storybook/react';

import { CardV2 } from './CardV2';

const meta = {
  title: 'Base Components/Layout/Card',
  component: CardV2,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CardV2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {
  args: {
    children: 'I am the card content',
  },
};
