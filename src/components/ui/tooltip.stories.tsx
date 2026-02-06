import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tooltip } from "./tooltip";
import { Button } from "./button";
import { Info } from "lucide-react";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    content: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-20">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  args: {
    content: "Tooltip on top",
    position: "top",
    children: <Button variant="outline">Hover me</Button>,
  },
};

export const Bottom: Story = {
  args: {
    content: "Tooltip on bottom",
    position: "bottom",
    children: <Button variant="outline">Hover me</Button>,
  },
};

export const Left: Story = {
  args: {
    content: "Tooltip on left",
    position: "left",
    children: <Button variant="outline">Hover me</Button>,
  },
};

export const Right: Story = {
  args: {
    content: "Tooltip on right",
    position: "right",
    children: <Button variant="outline">Hover me</Button>,
  },
};

export const WithIcon: Story = {
  render: () => (
    <Tooltip content="More information" position="top">
      <button className="p-1 rounded-full hover:bg-muted transition-colors">
        <Info className="w-4 h-4 text-muted-foreground" />
      </button>
    </Tooltip>
  ),
};

export const AllPositions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-12 p-8">
      <Tooltip content="Top tooltip" position="top">
        <Button variant="outline" size="sm">Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" position="bottom">
        <Button variant="outline" size="sm">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" position="left">
        <Button variant="outline" size="sm">Left</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" position="right">
        <Button variant="outline" size="sm">Right</Button>
      </Tooltip>
    </div>
  ),
};
