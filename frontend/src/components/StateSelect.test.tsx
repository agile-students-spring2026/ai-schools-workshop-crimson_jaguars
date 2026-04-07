import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StateSelect from "./StateSelect";

describe("StateSelect", () => {
  const states = ["NY", "CA", "TX"];

  it("renders the select element", () => {
    const handleChange = vi.fn();
    render(
      <StateSelect value="" states={states} onChange={handleChange} />
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders label text", () => {
    const handleChange = vi.fn();
    render(
      <StateSelect value="" states={states} onChange={handleChange} />
    );

    expect(screen.getByText(/select a state/i)).toBeInTheDocument();
  });

  it("renders all state options", () => {
    const handleChange = vi.fn();
    render(
      <StateSelect value="" states={states} onChange={handleChange} />
    );

    states.forEach((state) => {
      expect(screen.getByRole("option", { name: state })).toBeInTheDocument();
    });
  });

  it("sets the correct value", () => {
    const handleChange = vi.fn();
    render(
      <StateSelect value="CA" states={states} onChange={handleChange} />
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("CA");
  });

  it("calls onChange when selection changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <StateSelect value="" states={states} onChange={handleChange} />
    );

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "TX");

    expect(handleChange).toHaveBeenCalledWith("TX");
  });

  it("renders empty option", () => {
    const handleChange = vi.fn();
    render(
      <StateSelect value="" states={states} onChange={handleChange} />
    );

    expect(screen.getByRole("option", { name: /choose a state/i })).toBeInTheDocument();
  });

  it("handles empty states array", () => {
    const handleChange = vi.fn();
    render(
      <StateSelect value="" states={[]} onChange={handleChange} />
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
