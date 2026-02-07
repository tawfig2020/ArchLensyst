import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'success', 'warning'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'xs'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Sentinel Action', variant: 'default' },
};

export const Destructive: Story = {
  args: { children: 'Breach Alert', variant: 'destructive' },
};

export const Outline: Story = {
  args: { children: 'Logic Gate', variant: 'outline' },
};

export const Secondary: Story = {
  args: { children: 'Secondary Op', variant: 'secondary' },
};

export const Ghost: Story = {
  args: { children: 'Ghost Mode', variant: 'ghost' },
};

export const Success: Story = {
  args: { children: 'Invariant Pass', variant: 'success' },
};

export const Warning: Story = {
  args: { children: 'Caution Zone', variant: 'warning' },
};

export const Small: Story = {
  args: { children: 'Small', size: 'sm' },
};

export const Large: Story = {
  args: { children: 'Large Action', size: 'lg' },
};

export const ExtraSmall: Story = {
  args: { children: 'XS', size: 'xs' },
};
