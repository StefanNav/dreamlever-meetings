import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";

const meta: Meta<typeof Popover> = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Popover Content</h4>
          <p className="text-sm text-muted-foreground">
            This is the popover content area. It can contain any elements.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Quick Settings</h4>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Name</label>
            <input
              type="text"
              placeholder="Enter name..."
              className="w-full px-3 py-2 text-sm border border-border rounded-md"
            />
          </div>
          <Button size="sm" className="w-full">Save</Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
