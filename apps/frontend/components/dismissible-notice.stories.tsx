import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { DismissibleNotice } from "./dismissible-notice";

const meta = {
  title: "Components/DismissibleNotice",
  component: DismissibleNotice,
  args: {
    title: "Assignment updated",
    message: "The due date is now Friday at 5:00 PM.",
  },
} satisfies Meta<typeof DismissibleNotice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Dismiss notice" }),
    );

    await expect(canvas.queryByRole("status")).not.toBeInTheDocument();
  },
};

export const MultipleNotices: Story = {
  render: (args) => (
    <div className="space-y-4">
      <DismissibleNotice {...args} />
      <DismissibleNotice {...args} title="Enrollment updated" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const notices = within(canvasElement).getAllByRole("status");
    const headingIds = notices.map((notice) => {
      const heading = within(notice).getByRole("heading");

      expect(notice).toHaveAttribute("aria-labelledby", heading.id);

      return heading.id;
    });

    expect(new Set(headingIds).size).toBe(notices.length);
  },
};
