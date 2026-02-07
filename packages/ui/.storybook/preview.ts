import type { Preview } from '@storybook/react';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'citadel',
      values: [
        { name: 'citadel', value: '#0d1117' },
        { name: 'citadel-dark', value: '#020202' },
        { name: 'citadel-elevated', value: '#161b22' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    layout: 'centered',
  },
};

export default preview;
