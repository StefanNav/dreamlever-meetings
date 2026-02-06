import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusBadge } from "./status-badge";

const meta: Meta<typeof StatusBadge> = {
  title: "Meetings/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["live", "recurring", "upcoming", "past"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Live: Story = {
  args: { status: "live" },
};

export const Recurring: Story = {
  args: { status: "recurring" },
};

export const Upcoming: Story = {
  args: { status: "upcoming" },
  parameters: {
    docs: {
      description: {
        story: "Returns null for upcoming status -- nothing renders.",
      },
    },
  },
};

export const Past: Story = {
  args: { status: "past" },
  parameters: {
    docs: {
      description: {
        story: "Returns null for past status -- nothing renders.",
      },
    },
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex gap-3 items-center">
      <StatusBadge status="live" />
      <StatusBadge status="recurring" />
      <span className="text-xs text-muted-foreground">(upcoming/past render nothing)</span>
    </div>
  ),
};
