import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultsPage, computeToggleIds, resolveCompareDistricts } from "./ResultsPage";
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

  it("shows compare banner after selecting one district", async () => {
    const user = userEvent.setup();
    renderPage();

    const [first] = screen.getAllByRole("button", { name: "Compare" });
    await user.click(first);

    expect(screen.getByText(/selected for comparison/i)).toBeInTheDocument();
    expect(screen.getByText(/1\/2/)).toBeInTheDocument();
  });

  it("enables compare button after selecting two districts", async () => {
    const user = userEvent.setup();
    renderPage();

    const [first, second] = screen.getAllByRole("button", { name: "Compare" });
    await user.click(first);
    await user.click(second);

    expect(screen.getByText(/2\/2/)).toBeInTheDocument();
    const compareBarBtn = screen.getByRole("button", { name: "Compare →" });
    expect(compareBarBtn).not.toBeDisabled();
  });

  it("deselects a district when toggled again", async () => {
    const user = userEvent.setup();
    renderPage();

    const [first] = screen.getAllByRole("button", { name: "Compare" });
    await user.click(first);

    const selectedBtn = screen.getByRole("button", { name: "Selected" });
    await user.click(selectedBtn);

    expect(screen.queryByText(/selected for comparison/i)).not.toBeInTheDocument();
  });

  it("does not allow selecting more than two districts", async () => {
    const user = userEvent.setup();
    renderPage();

    const compareButtons = screen.getAllByRole("button", { name: "Compare" });
    await user.click(compareButtons[0]);
    await user.click(compareButtons[1]);

    // Remaining un-selected district compare buttons should be disabled
    const stillCompare = screen.getAllByRole("button", { name: "Compare" });
    stillCompare.forEach((btn) => expect(btn).toBeDisabled());
  });

  it("calls onCompare with two districts when compare bar is clicked", async () => {
    const user = userEvent.setup();
    const { onCompare } = renderPage();

    const [first, second] = screen.getAllByRole("button", { name: "Compare" });
    await user.click(first);
    await user.click(second);

    const compareBarBtn = screen.getByRole("button", { name: "Compare →" });
    await user.click(compareBarBtn);

    expect(onCompare).toHaveBeenCalledTimes(1);
    const [districts] = onCompare.mock.calls[0];
    expect(districts).toHaveLength(2);
  });

  it("shows state abbreviation in header for states not in STATE_NAMES", () => {
    renderPage("TX");
    // TX is not in STATE_NAMES so stateLabel falls back to "TX"
    expect(screen.getByText(/TX Districts/)).toBeInTheDocument();
  });

});

describe("computeToggleIds", () => {
  it("adds an id to an empty list", () => {
    expect(computeToggleIds([], "a")).toEqual(["a"]);
  });

  it("adds an id to a list with one entry", () => {
    expect(computeToggleIds(["a"], "b")).toEqual(["a", "b"]);
  });

  it("removes an id that is already in the list", () => {
    expect(computeToggleIds(["a", "b"], "a")).toEqual(["b"]);
  });

  it("returns the same list unchanged when already at capacity of 2", () => {
    const prev = ["a", "b"];
    expect(computeToggleIds(prev, "c")).toBe(prev);
  });
});

describe("resolveCompareDistricts", () => {
  const [d1, d2] = mockDistricts;

  it("returns null when fewer than 2 ids provided", () => {
    expect(resolveCompareDistricts([d1.id], mockDistricts)).toBeNull();
  });

  it("returns null when 0 ids provided", () => {
    expect(resolveCompareDistricts([], mockDistricts)).toBeNull();
  });

  it("returns a pair of districts when both ids are valid", () => {
    const result = resolveCompareDistricts([d1.id, d2.id], mockDistricts);
    expect(result).toEqual([d1, d2]);
  });

  it("returns null when one or both ids are not found", () => {
    expect(resolveCompareDistricts(["unknown1", "unknown2"], mockDistricts)).toBeNull();
  });
});
