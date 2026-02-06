import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Switch } from "./switch";
import { useState } from "react";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
};

export const WithLabel: Story = {
  render: () => {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">AI</span>
        <Switch defaultChecked className="data-[state=checked]:bg-cyan" />
      </div>
    );
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Small</span>
        <Switch size="sm" defaultChecked />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Default</span>
        <Switch defaultChecked />
      </div>
    </div>
  ),
};
