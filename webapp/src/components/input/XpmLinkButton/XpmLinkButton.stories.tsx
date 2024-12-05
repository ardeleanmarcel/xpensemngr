import type { Meta, StoryObj } from '@storybook/react';

import { XpmLinkButton } from './XpmLinkButton';
import { fn } from '@storybook/test';

// TODO (Valle) -> can this work without the react-rotuter-dom dependency?
const meta = {
  title: 'Base Components/Feedback/LoadingSpinner',
  component: XpmLinkButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { text: 'click Me', onClick: fn(), to: '/' },
} satisfies Meta<typeof XpmLinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {};
