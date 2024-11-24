import type { Meta, StoryObj } from '@storybook/react';

import { XpmInputText } from './XpmInputText';

const meta = {
  title: 'Base Components/Input/Text',
  component: XpmInputText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof XpmInputText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {
  args: {
    value: 'Here is the content',
  },
};
