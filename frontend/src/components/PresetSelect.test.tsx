import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PresetSelect from "./PresetSelect";
import type { PresetOption } from "../lib/presets";

describe("PresetSelect", () => {
  const options: PresetOption[] = [
    { value: "academic", label: "Academic Focus" },
    { value: "balancedFamily", label: "Balanced Family Fit" },
  ];

  it("renders the select element", () => {
    const handleChange = vi.fn();
    render(
      <PresetSelect
        value="academic"
        options={options}
        onChange={handleChange}
      />
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders label text", () => {
    const handleChange = vi.fn();
    render(
      <PresetSelect
        value="academic"
        options={options}
        onChange={handleChange}
      />
    );

    expect(screen.getByText(/choose a priority preset/i)).toBeInTheDocument();
  });

  it("renders all preset options", () => {
    const handleChange = vi.fn();
    render(
      <PresetSelect
        value="academic"
        options={options}
        onChange={handleChange}
      />
    );

    options.forEach((preset) => {
      expect(
        screen.getByRole("option", { name: preset.label })
      ).toBeInTheDocument();
    });
  });

  it("sets the correct value", () => {
    const handleChange = vi.fn();
    render(
      <PresetSelect
        value="balancedFamily"
        options={options}
        onChange={handleChange}
      />
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("balancedFamily");
  });

  it("calls onChange when selection changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <PresetSelect
        value="academic"
        options={options}
        onChange={handleChange}
      />
    );

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "balancedFamily");

    expect(handleChange).toHaveBeenCalledWith("balancedFamily");
  });

  it("handles single preset option", () => {
    const handleChange = vi.fn();
    const singleOption: PresetOption[] = [
      { value: "academic", label: "Academic Focus" },
    ];

    render(
      <PresetSelect
        value="academic"
        options={singleOption}
        onChange={handleChange}
      />
    );

    expect(screen.getByRole("option", { name: "Academic Focus" })).toBeInTheDocument();
  });
});
