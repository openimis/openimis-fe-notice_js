import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, waitFor } from "@openimis/fe-core/testing";
import NoticeDescriptionEditor from "./NoticeDescriptionEditor";

// The fe-core barrel cannot be loaded from a test: stub the one export the editor uses.
vi.mock("@openimis/fe-core", () => ({
  formatMessage: (intl, module, key) => `${module}.${key}`,
}));

describe("NoticeDescriptionEditor", () => {
  it("shows the notice description in an editable area", async () => {
    const { container } = renderWithProviders(
      <NoticeDescriptionEditor value="<p>Clinic closed on Friday</p>" onChange={() => {}} />,
    );

    expect(await screen.findByText("Clinic closed on Friday")).toBeInTheDocument();
    expect(container.querySelector(".ql-editor")).toHaveAttribute("contenteditable", "true");
  });

  it("follows a description changed from outside", async () => {
    const { container, rerender } = renderWithProviders(
      <NoticeDescriptionEditor value="<p>First</p>" onChange={() => {}} />,
    );
    await screen.findByText("First");

    rerender(<NoticeDescriptionEditor value="<p>Second</p>" onChange={() => {}} />);

    await waitFor(() => expect(container.querySelector(".ql-editor")).toHaveTextContent("Second"));
  });

  it("is read only when asked", async () => {
    const { container } = renderWithProviders(<NoticeDescriptionEditor value="<p>Fixed</p>" readOnly />);

    await screen.findByText("Fixed");
    expect(container.querySelector(".ql-editor")).toHaveAttribute("contenteditable", "false");
  });
});
