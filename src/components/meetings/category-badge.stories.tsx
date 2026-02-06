import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CategoryBadge } from "./category-badge";

const meta: Meta<typeof CategoryBadge> = {
  title: "Meetings/CategoryBadge",
  component: CategoryBadge,
  tags: ["autodocs"],
  argTypes: {
    category: {
      control: "select",
      options: ["operations", "design", "engineering", "marketing", "sales"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CategoryBadge>;

export const Operations: Story = {
  args: { category: "operations" },
};

export const Design: Story = {
  args: { category: "design" },
};

export const Engineering: Story = {
  args: { category: "engineering" },
};

export const Marketing: Story = {
  args: { category: "marketing" },
};

export const Sales: Story = {
  args: { category: "sales" },
};

export const AllCategories: Story = {
  render: () => (
    <div className="flex gap-3 flex-wrap">
      <CategoryBadge category="operations" />
      <CategoryBadge category="design" />
      <CategoryBadge category="engineering" />
      <CategoryBadge category="marketing" />
      <CategoryBadge category="sales" />
    </div>
  ),
};
