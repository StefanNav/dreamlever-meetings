import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ConfirmDialog } from "./confirm-dialog";
import { useState } from "react";
import { Button } from "./button";

const meta: Meta<typeof ConfirmDialog> = {
  title: "UI/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "danger"],
    },
    isOpen: { control: "boolean" },
    title: { control: "text" },
    description: { control: "text" },
    confirmLabel: { control: "text" },
    cancelLabel: { control: "text" },
    isLoading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex items-center justify-center p-20">
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <ConfirmDialog
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          title="Confirm Action"
          description="Are you sure you want to proceed? This action cannot be undone."
        />
      </div>
    );
  },
};

export const Danger: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex items-center justify-center p-20">
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete Item
        </Button>
        <ConfirmDialog
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          title="Delete Action Item"
          description="This will permanently delete this action item. This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Keep"
          variant="danger"
        />
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex items-center justify-center p-20">
        <Button onClick={() => setOpen(true)}>Open Loading Dialog</Button>
        <ConfirmDialog
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={() => {}}
          title="Deleting..."
          description="Please wait while we delete this item."
          variant="danger"
          isLoading={true}
        />
      </div>
    );
  },
};
