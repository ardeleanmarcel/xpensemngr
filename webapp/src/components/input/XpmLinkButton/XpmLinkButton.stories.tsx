import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { XpmLinkButton, XpmLinkButtonProps } from './XpmLinkButton';
import { BrowserRouter } from 'react-router-dom';

const StoryComponent = (args: XpmLinkButtonProps) => (
  <BrowserRouter>
    <XpmLinkButton {...args} />
  </BrowserRouter>
);

const meta = {
  title: 'Base Components/Input/LinkButton',
  component: StoryComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { text: 'click Me', onClick: fn(() => alert('clicked')) },
} satisfies Meta<typeof XpmLinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {};
