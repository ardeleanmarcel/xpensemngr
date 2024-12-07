import type { Meta, StoryObj } from '@storybook/react';

import { XpmLoadingSpinner } from './XpmLoadingSpinner';

const meta = {
  title: 'Base Components/Feedback/LoadingSpinner',
  component: XpmLoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { isVisible: true },
} satisfies Meta<typeof XpmLoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {
  args: {
    fullscreen: true,
  },
};
