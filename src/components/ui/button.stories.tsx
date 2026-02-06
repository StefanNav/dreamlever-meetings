import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import { Plus, Trash2, Settings, Loader2 } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: "Button" },
};

export const Destructive: Story = {
  args: { children: "Delete", variant: "destructive" },
};

export const Outline: Story = {
  args: { children: "Outline", variant: "outline" },
};

export const Secondary: Story = {
  args: { children: "Secondary", variant: "secondary" },
};

export const Ghost: Story = {
  args: { children: "Ghost", variant: "ghost" },
};

export const Link: Story = {
  args: { children: "Link", variant: "link" },
};

export const Small: Story = {
  args: { children: "Small", size: "sm" },
};

export const Large: Story = {
  args: { children: "Large", size: "lg" },
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button className="gap-2">
        <Plus className="w-4 h-4" /> Add item
      </Button>
      <Button variant="destructive" className="gap-2">
        <Trash2 className="w-4 h-4" /> Delete
      </Button>
      <Button variant="outline" className="gap-2">
        <Settings className="w-4 h-4" /> Settings
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button size="icon"><Plus className="w-4 h-4" /></Button>
      <Button size="icon-sm"><Settings className="w-4 h-4" /></Button>
      <Button size="icon-lg"><Trash2 className="w-4 h-4" /></Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
};

export const Loading: Story = {
  render: () => (
    <Button disabled className="gap-2">
      <Loader2 className="w-4 h-4 animate-spin" /> Loading...
    </Button>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex gap-3 items-center">
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>
    </div>
  ),
};
