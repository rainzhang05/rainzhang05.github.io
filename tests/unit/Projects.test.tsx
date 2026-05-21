import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Projects } from "@/sections/portfolio/Projects";
import { PROJECTS } from "@/lib/data/projects";

describe("Projects", () => {
  it("renders a card for every PROJECTS entry", () => {
    render(<Projects openId={null} setOpenId={vi.fn()} />);
    PROJECTS.forEach((p) => {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    });
  });

  it("collapses every card when openId is null", () => {
    render(<Projects openId={null} setOpenId={vi.fn()} />);
    const buttons = screen.getAllByRole("button", { expanded: false });
    expect(buttons.length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { expanded: true })).toBeNull();
  });

  it("expands the card whose id matches openId", () => {
    render(<Projects openId="security-demo" setOpenId={vi.fn()} />);
    const expanded = screen.getAllByRole("button", { expanded: true });
    expect(expanded.length).toBe(1);
  });

  it("clicking a collapsed card calls setOpenId with its id", () => {
    const setOpenId = vi.fn();
    render(<Projects openId={null} setOpenId={setOpenId} />);
    const collapsed = screen.getAllByRole("button", { expanded: false });
    fireEvent.click(collapsed[0]);
    expect(setOpenId).toHaveBeenCalledTimes(1);
    expect(setOpenId.mock.calls[0][0]).toBe(PROJECTS[0].id);
  });

  it("clicking the currently expanded card calls setOpenId(null) — toggle off", () => {
    const setOpenId = vi.fn();
    render(<Projects openId={PROJECTS[0].id} setOpenId={setOpenId} />);
    const expanded = screen.getByRole("button", { expanded: true });
    fireEvent.click(expanded);
    expect(setOpenId).toHaveBeenCalledWith(null);
  });
});
