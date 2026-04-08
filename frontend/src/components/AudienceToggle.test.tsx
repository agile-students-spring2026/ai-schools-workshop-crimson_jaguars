import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AudienceToggle from "./AudienceToggle";

describe("AudienceToggle", () => {
  it("renders toggle buttons", () => {
    const handleChange = vi.fn();
    render(<AudienceToggle value="parent" onChange={handleChange} />);

    expect(screen.getByRole("button", { name: /parent/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /educator/i })).toBeInTheDocument();
  });

  it("highlights the active button", () => {
    const handleChange = vi.fn();
    render(<AudienceToggle value="parent" onChange={handleChange} />);

    const parentBtn = screen.getByRole("button", { name: /parent/i });
    expect(parentBtn).toHaveClass("active");
  });

  it("calls onChange when button is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<AudienceToggle value="parent" onChange={handleChange} />);

    const educatorBtn = screen.getByRole("button", { name: /educator/i });
    await user.click(educatorBtn);

    expect(handleChange).toHaveBeenCalledWith("educator");
  });

  it("renders label text", () => {
    const handleChange = vi.fn();
    render(<AudienceToggle value="parent" onChange={handleChange} />);

    expect(screen.getByText(/who are you evaluating for/i)).toBeInTheDocument();
  });
});
