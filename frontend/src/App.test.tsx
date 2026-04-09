import { describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

afterEach(() => {
  window.history.pushState({}, "", "/");
});

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
  });

  it("shows home page on initial load", () => {
    render(<App />);
    expect(
      screen.getByText(/compare school districts by your priorities/i)
    ).toBeInTheDocument();
  });

  // ResultsRoute tests
  it("renders results page for /results route", () => {
    window.history.pushState(
      {},
      "",
      "/results?state=NY&audience=parent&preset=academic"
    );
    render(<App />);
    expect(screen.getByText(/new york districts/i)).toBeInTheDocument();
  });

  it("defaults audience to parent when value is invalid", () => {
    window.history.pushState(
      {},
      "",
      "/results?state=NY&audience=INVALID&preset=academic"
    );
    render(<App />);
    expect(screen.getByText(/parent view/i)).toBeInTheDocument();
  });

  it("defaults preset to academic when value is invalid", () => {
    window.history.pushState(
      {},
      "",
      "/results?state=NY&audience=parent&preset=INVALID"
    );
    render(<App />);
    expect(screen.getByText(/academic excellence/i)).toBeInTheDocument();
  });

  it("defaults state to NY when state param is missing", () => {
    window.history.pushState({}, "", "/results?audience=parent&preset=academic");
    render(<App />);
    expect(screen.getByText(/new york districts/i)).toBeInTheDocument();
  });

  it("navigates to compare page when compare is triggered from results", async () => {
    const user = userEvent.setup();
    window.history.pushState(
      {},
      "",
      "/results?state=NY&audience=parent&preset=academic"
    );
    render(<App />);

    const [first, second] = screen.getAllByRole("button", { name: "Compare" });
    await user.click(first);
    await user.click(second);
    await user.click(screen.getByRole("button", { name: "Compare →" }));

    expect(screen.getByText(/comparing/i)).toBeInTheDocument();
  });

  it("navigates back to home when back is clicked on results page", async () => {
    const user = userEvent.setup();
    window.history.pushState(
      {},
      "",
      "/results?state=NY&audience=parent&preset=academic"
    );
    render(<App />);

    await user.click(screen.getByRole("button", { name: /back/i }));
    expect(
      screen.getByText(/compare school districts by your priorities/i)
    ).toBeInTheDocument();
  });

  // CompareRoute tests
  it("renders compare page for /compare route with valid district IDs", () => {
    window.history.pushState(
      {},
      "",
      "/compare?a=ny-scarsdale&b=ny-jericho"
    );
    render(<App />);
    expect(screen.getByText(/comparing/i)).toBeInTheDocument();
  });

  it("shows invalid comparison message when a or b param is missing", () => {
    window.history.pushState({}, "", "/compare");
    render(<App />);
    expect(screen.getByText(/invalid comparison/i)).toBeInTheDocument();
  });

  it("shows districts not found message for unknown district IDs", () => {
    window.history.pushState({}, "", "/compare?a=unknown-1&b=unknown-2");
    render(<App />);
    expect(screen.getByText(/districts not found/i)).toBeInTheDocument();
  });

  it("navigates back to home when back is clicked on compare page", async () => {
    const user = userEvent.setup();
    window.history.pushState(
      {},
      "",
      "/compare?a=ny-scarsdale&b=ny-jericho"
    );
    render(<App />);

    await user.click(screen.getByRole("button", { name: /back/i }));
    expect(
      screen.getByText(/compare school districts by your priorities/i)
    ).toBeInTheDocument();
  });
});
