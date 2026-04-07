import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComparePage } from "./ComparePage";
import { mockDistricts } from "../data/mockDistricts";

describe("ComparePage", () => {
  const [district1, district2] = mockDistricts.slice(0, 2);

  function renderPage() {
    const onBack = vi.fn();
    render(
      <ComparePage districts={[district1, district2]} onBack={onBack} />
    );
    return { onBack };
  }

  it("displays both district names in title", () => {
    renderPage();
    expect(
      screen.getByText(
        new RegExp(`comparing.*${district1.name}.*${district2.name}`, "i")
      )
    ).toBeInTheDocument();
  });

  it("displays district scores", () => {
    renderPage();
    expect(screen.getByText(district1.score.toFixed(1))).toBeInTheDocument();
    expect(screen.getByText(district2.score.toFixed(1))).toBeInTheDocument();
  });

  it("displays all comparison metrics", () => {
    renderPage();
    expect(screen.getByText(/graduation rate/i)).toBeInTheDocument();
    expect(screen.getByText(/per pupil spending/i)).toBeInTheDocument();
    expect(screen.getByText(/student-teacher ratio/i)).toBeInTheDocument();
    expect(screen.getByText(/enrollment/i)).toBeInTheDocument();
    expect(screen.getByText(/poverty index/i)).toBeInTheDocument();
  });

  it("formats graduation rate as percentage", () => {
    renderPage();
    const percentage = `${district1.graduationRate.toFixed(1)}%`;
    expect(screen.getByText(new RegExp(percentage))).toBeInTheDocument();
  });

  it("renders back button", () => {
    const { onBack } = renderPage();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("calls onBack when back button clicked", async () => {
    const user = userEvent.setup();
    const { onBack } = renderPage();

    const backBtn = screen.getByRole("button", { name: /back/i });
    await user.click(backBtn);

    expect(onBack).toHaveBeenCalled();
  });

  it("displays district names in summary cards", () => {
    renderPage();
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.length).toBe(2);
  });

  it("displays states in summary cards", () => {
    renderPage();
    expect(screen.getAllByText(district1.state).length).toBeGreaterThan(0);
  });

  it("formats spending as currency", () => {
    renderPage();
    // Check that spending appears (formatted with $ and commas)
    expect(screen.getByText(/\$.*22.*850/)).toBeInTheDocument();
  });

  it("formats student ratio as 1:X", () => {
    renderPage();
    const ratio = `1:${district1.studentTeacherRatio.toFixed(1)}`;
    expect(screen.getByText(new RegExp(ratio.replace(/\./g, "\\."))))
      .toBeInTheDocument();
  });

  it("displays enrollment with thousand separators", () => {
    renderPage();
    const enrollment = district1.enrollment.toLocaleString();
    expect(screen.getByText(new RegExp(enrollment.replace(/,/g, "[,]?")))).toBeInTheDocument();
  });

  it("displays poverty index as percentage", () => {
    renderPage();
    const povertyStr = `${district1.povertyIndex.toFixed(1)}%`;
    expect(screen.getByText(new RegExp(povertyStr))).toBeInTheDocument();
  });
});
