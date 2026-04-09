import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DistrictCard } from "./DistrictCard";
import type { ScoredDistrict } from "../lib/types";

const mockDistrict: ScoredDistrict = {
  id: "ny-test",
  name: "Test School District",
  state: "NY",
  graduationRate: 90,
  perPupilSpending: 20000,
  studentTeacherRatio: 15,
  enrollment: 5000,
  povertyIndex: 20,
  score: 85,
};

function renderCard(overrides: Partial<Parameters<typeof DistrictCard>[0]> = {}) {
  const defaults = {
    district: mockDistrict,
    rank: 1,
    isSelected: false,
    onToggleCompare: vi.fn(),
    compareDisabled: false,
  };
  return render(<DistrictCard {...defaults} {...overrides} />);
}

describe("DistrictCard", () => {
  it("renders district name", () => {
    renderCard();
    expect(screen.getByText("Test School District")).toBeInTheDocument();
  });

  it("renders rank number", () => {
    renderCard({ rank: 3 });
    expect(screen.getByText("#3")).toBeInTheDocument();
  });

  it("renders district score", () => {
    renderCard();
    expect(screen.getByText("85")).toBeInTheDocument();
  });

  it("renders 'Compare' button when not selected", () => {
    renderCard({ isSelected: false });
    expect(screen.getByRole("button", { name: "Compare" })).toBeInTheDocument();
  });

  it("renders 'Selected' button when isSelected is true", () => {
    renderCard({ isSelected: true });
    expect(screen.getByRole("button", { name: "Selected" })).toBeInTheDocument();
  });

  it("applies purple border class when isSelected is true", () => {
    const { container } = renderCard({ isSelected: true });
    expect(container.firstChild).toHaveClass("border-purple-500");
  });

  it("applies default border class when isSelected is false", () => {
    const { container } = renderCard({ isSelected: false });
    expect(container.firstChild).toHaveClass("border-gray-700");
  });

  it("disables compare button when compareDisabled is true", () => {
    renderCard({ compareDisabled: true });
    expect(screen.getByRole("button", { name: "Compare" })).toBeDisabled();
  });

  it("calls onToggleCompare with district id when button clicked", async () => {
    const user = userEvent.setup();
    const onToggleCompare = vi.fn();
    renderCard({ onToggleCompare });
    await user.click(screen.getByRole("button", { name: "Compare" }));
    expect(onToggleCompare).toHaveBeenCalledWith("ny-test");
  });

  it("calls onToggleCompare when selected button clicked", async () => {
    const user = userEvent.setup();
    const onToggleCompare = vi.fn();
    renderCard({ isSelected: true, onToggleCompare });
    await user.click(screen.getByRole("button", { name: "Selected" }));
    expect(onToggleCompare).toHaveBeenCalledWith("ny-test");
  });

  it("renders graduation rate metric", () => {
    renderCard();
    expect(screen.getByText("Graduation rate")).toBeInTheDocument();
    expect(screen.getByText("90%")).toBeInTheDocument();
  });

  it("renders per-pupil spending metric formatted as currency", () => {
    renderCard();
    expect(screen.getByText("Per-pupil spending")).toBeInTheDocument();
    expect(screen.getByText("$20,000")).toBeInTheDocument();
  });

  it("renders student-teacher ratio metric", () => {
    renderCard();
    expect(screen.getByText("Student-teacher ratio")).toBeInTheDocument();
    expect(screen.getByText("15:1")).toBeInTheDocument();
  });

  it("renders poverty index metric", () => {
    renderCard();
    expect(screen.getByText("Poverty index")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
  });

  it("renders enrollment count", () => {
    renderCard();
    expect(screen.getByText(/5,000 students/)).toBeInTheDocument();
  });

  it("shows score in teal for high scores (>=80)", () => {
    renderCard({ district: { ...mockDistrict, score: 85 } });
    expect(screen.getByText("85")).toHaveClass("text-teal-400");
  });

  it("shows score in yellow for medium scores (60-79)", () => {
    renderCard({ district: { ...mockDistrict, score: 70 } });
    expect(screen.getByText("70")).toHaveClass("text-yellow-400");
  });

  it("shows score in red for low scores (<60)", () => {
    renderCard({ district: { ...mockDistrict, score: 40 } });
    expect(screen.getByText("40")).toHaveClass("text-red-400");
  });
});
