import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import HomePage from "./HomePage";

describe("HomePage", () => {
  function renderPage() {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  }

  it("renders the title", () => {
    renderPage();
    expect(
      screen.getByRole("heading", {
        name: /compare school districts by your priorities/i,
      })
    ).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    renderPage();
    expect(
      screen.getByText(/pick whether you/i)
    ).toBeInTheDocument();
  });

  it("renders audience toggle", () => {
    renderPage();
    expect(screen.getByText(/who are you evaluating for/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /parent/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /educator/i })).toBeInTheDocument();
  });

  it("renders state selector", () => {
    renderPage();
    expect(screen.getByText(/select a state/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /select a state/i })).toBeInTheDocument();
  });

  it("renders preset selector", () => {
    renderPage();
    expect(screen.getByText(/choose a priority preset/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /choose a priority preset/i })).toBeInTheDocument();
  });

  it("renders submit button", () => {
    renderPage();
    expect(
      screen.getByRole("button", { name: /view districts/i })
    ).toBeInTheDocument();
  });

  it("disables submit button when state is not selected", () => {
    renderPage();
    const btn = screen.getByRole("button", { name: /view districts/i });
    expect(btn).toBeDisabled();
  });

  it("enables submit button when state is selected", async () => {
    const user = userEvent.setup();
    renderPage();

    const stateSelect = screen.getByRole("combobox", { name: /select a state/i });
    await user.selectOptions(stateSelect, "NY");

    const btn = screen.getByRole("button", { name: /view districts/i });
    expect(btn).not.toBeDisabled();
  });

  it("changes preset when audience changes", async () => {
    const user = userEvent.setup();
    renderPage();

    const educatorBtn = screen.getByRole("button", { name: /educator/i });
    await user.click(educatorBtn);

    const presetSelect = screen.getByRole("combobox", {
      name: /choose a priority preset/i,
    });
    expect(presetSelect).toHaveValue("classroomConditions");
  });

  it("keeps state selection when audience changes", async () => {
    const user = userEvent.setup();
    renderPage();

    const stateSelect = screen.getByRole("combobox", { name: /select a state/i });
    await user.selectOptions(stateSelect, "CA");
    expect(stateSelect).toHaveValue("CA");

    const educatorBtn = screen.getByRole("button", { name: /educator/i });
    await user.click(educatorBtn);

    expect(stateSelect).toHaveValue("CA");
  });

  it("updates preset when changed", async () => {
    const user = userEvent.setup();
    renderPage();

    const presetSelect = screen.getByRole("combobox", {
      name: /choose a priority preset/i,
    });
    await user.selectOptions(presetSelect, "smallClassrooms");

    expect(presetSelect).toHaveValue("smallClassrooms");
  });

  it("shows SchoolScout branding", () => {
    renderPage();
    expect(screen.getByText("SchoolScout")).toBeInTheDocument();
  });

  it("audience toggle defaults to parent", () => {
    renderPage();
    const parentBtn = screen.getByRole("button", { name: /parent/i });
    expect(parentBtn).toHaveClass("active");
  });

  it("shows state options", async () => {
    const user = userEvent.setup();
    renderPage();

    const stateSelect = screen.getByRole("combobox", { name: /select a state/i });
    await user.click(stateSelect);

    expect(screen.getByRole("option", { name: "NY" })).toBeInTheDocument();
  });
});
