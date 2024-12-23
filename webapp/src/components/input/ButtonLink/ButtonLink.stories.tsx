import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { BrowserRouter } from 'react-router-dom';

import { ButtonLink, XpmLinkButtonProps } from './ButtonLink';

const StoryComponent = (args: XpmLinkButtonProps) => (
  <BrowserRouter>
    <ButtonLink {...args} />
  </BrowserRouter>
);

const meta = {
  title: 'Base Components/Input/ButtonLink',
  component: StoryComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { text: 'click Me', onClick: fn(() => alert('clicked')) },
} satisfies Meta<typeof ButtonLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {};
