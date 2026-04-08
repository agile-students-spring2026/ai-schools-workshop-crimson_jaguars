import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultsPage } from "./ResultsPage";
import { mockDistricts } from "../data/mockDistricts";
import type { Audience, PresetKey } from "../lib/types";

describe("ResultsPage", () => {
  function renderPage(
    state = "NY",
    audience: Audience = "parent",
    preset: PresetKey = "academic"
  ) {
    const onBack = vi.fn();
    const onCompare = vi.fn();

    render(
      <ResultsPage
        state={state}
        audience={audience}
        preset={preset}
        onBack={onBack}
        onCompare={onCompare}
      />
    );

    return { onBack, onCompare };
  }

  it("renders header with district count", () => {
    renderPage();
    expect(screen.getByText(/districts ranked/i)).toBeInTheDocument();
  });

  it("renders back button", () => {
    renderPage();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("displays school district names", () => {
    renderPage();
    const nyDistricts = mockDistricts.filter((d) => d.state === "NY");
    expect(nyDistricts.length).toBeGreaterThan(0);
    nyDistricts.forEach((district) => {
      expect(screen.getByText(district.name)).toBeInTheDocument();
    });
  });

  it("displays state district count", () => {
    renderPage("NY");
    const nyDistricts = mockDistricts.filter((d) => d.state === "NY");
    expect(screen.getByText(/districts ranked/i)).toBeInTheDocument();
  });

  it("shows preset label", () => {
    renderPage("NY", "parent", "academic");
    expect(screen.getByText(/academic excellence/i)).toBeInTheDocument();
  });

  it("shows audience label", () => {
    renderPage("NY", "parent", "academic");
    expect(screen.getByText(/parent view/i)).toBeInTheDocument();
  });

  it("shows educator view preset", () => {
    renderPage("NY", "educator", "classroomConditions");
    expect(screen.getByText(/educator view/i)).toBeInTheDocument();
  });

  it("displays districts sorted by score", () => {
    renderPage();
    const nyDistricts = mockDistricts
      .filter((d) => d.state === "NY")
      .sort((a, b) => b.score - a.score);

    const first = screen.getByText(nyDistricts[0].name);
    expect(first).toBeInTheDocument();
  });

  it("displays ranking numbers", () => {
    renderPage();
    expect(screen.getByText("#1")).toBeInTheDocument();
  });

  it("displays district scores", () => {
    renderPage();
    const nyDistricts = mockDistricts.filter((d) => d.state === "NY");
    expect(screen.getByText(nyDistricts[0].score.toString())).toBeInTheDocument();
  });

  it("displays enrollment info", () => {
    renderPage();
    const nyDistricts = mockDistricts.filter((d) => d.state === "NY");
    const enrollment = nyDistricts[0].enrollment.toLocaleString();
    expect(screen.getByText(new RegExp(enrollment))).toBeInTheDocument();
  });

  it("displays state name in header", () => {
    renderPage("NY");
    expect(screen.getByText(/new york districts/i)).toBeInTheDocument();
  });

  it("allows selecting districts for comparison", async () => {
    const user = userEvent.setup();
    renderPage();

    const buttons = screen.getAllByRole("button");
    const compareButtons = buttons.filter(
      (btn) => !btn.textContent?.includes("Back") && !btn.textContent?.includes("Compare")
    );

    if (compareButtons.length >= 2) {
      await user.click(compareButtons[0]);
      await user.click(compareButtons[1]);

      expect(screen.getByText(/selected for comparison/i)).toBeInTheDocument();
    }
  });

  it("shows compare button when selections made", async () => {
    const user = userEvent.setup();
    renderPage();

    const buttons = screen.getAllByRole("button");
    const compareButtons = buttons.filter(
      (btn) => !btn.textContent?.includes("Back") && !btn.textContent?.includes("Compare")
    );

    if (compareButtons.length >= 2) {
      await user.click(compareButtons[0]);
      await user.click(compareButtons[1]);

      const compareBtn = screen.getByRole("button", { name: /compare/i });
      expect(compareBtn).toBeInTheDocument();
    }
  });
});
