import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      values: [
        {
          name: 'light',
          value: '#F8F8FF',
        },
        {
          name: 'dark',
          value: '#121212',
        },
        {
          name: 'gray',
          value: '#D9D9D9',
        },
      ],
      default: 'light',
    },
  },
};

export default preview;
