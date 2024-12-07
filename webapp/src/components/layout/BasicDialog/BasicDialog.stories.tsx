import type { Meta, StoryObj } from '@storybook/react';

import { BasicDialog } from './BasicDialog';

const meta = {
  title: 'Base Components/Layout/BasicDialog',
  component: BasicDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    isOpen: true,
    onBackdropClick: () => console.log('clicked backdrop'),
    children: 'i am the dialog content',
  },
} satisfies Meta<typeof BasicDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {
  args: {},
};
