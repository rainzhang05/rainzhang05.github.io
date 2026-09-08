import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { BootGate } from "@/components/site/BootGate";
import { bootFlag } from "@/lib/boot";
import { mockMatchMedia, type MatchMediaController } from "../setup/dom-mocks";

/**
 * The gate has one job it must never fail at: settling. A sheet that never
 * lifts is an invisible site, so every case here is about something going
 * wrong and the gate finishing anyway.
 */
describe("BootGate", () => {
  let media: MatchMediaController;

  beforeEach(() => {
    media = mockMatchMedia(false);
    document.documentElement.dataset.boot = "pending";
    delete window.__bootLive;
    sessionStorage.clear();

    const sheet = document.createElement("div");
    sheet.id = "boot";
    document.body.appendChild(sheet);
  });

  afterEach(() => {
    media.restore();
    document.getElementById("boot")?.remove();
    document.querySelectorAll("img").forEach((img) => img.remove());
    delete document.documentElement.dataset.boot;
  });

  const settled = () =>
    waitFor(() => expect(document.documentElement.dataset.boot).toBe("done"), { timeout: 4000 });

  it("tells the inline script to stand down", () => {
    render(<BootGate />);

    expect(window.__bootLive).toBe(true);
  });

  it("lifts the sheet when there is nothing to wait for", async () => {
    render(<BootGate />);

    await settled();
    expect(sessionStorage.getItem(bootFlag)).toBe("1");
  });

  it("counts a failed image as arrived rather than waiting on it", async () => {
    const img = document.createElement("img");
    img.src = "/tech/does-not-exist.png";
    document.body.appendChild(img);

    render(<BootGate />);
    // After the gate's own first-frame wait, so the listener is attached.
    setTimeout(() => img.dispatchEvent(new Event("error")), 200);

    await settled();
  });

  it("does not take over a sheet a failsafe has already lowered", async () => {
    document.documentElement.dataset.boot = "done";

    render(<BootGate />);

    // No leaving state, no flag written: there was nothing left to own.
    expect(document.documentElement.dataset.boot).toBe("done");
    expect(sessionStorage.getItem(bootFlag)).toBeNull();
  });

  it("gives up on an image that never answers", async () => {
    // Reduced motion carries the short deadline, which is what makes this
    // testable in a second rather than ten; the mechanism is the same one that
    // catches a stalled socket on a normal load.
    media.restore();
    media = mockMatchMedia(true);

    const img = document.createElement("img");
    img.src = "/tech/never-answers.png";
    document.body.appendChild(img);

    render(<BootGate />);

    await settled();
  });

  it("survives storage it is not allowed to write", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });

    render(<BootGate />);

    await settled();
    setItem.mockRestore();
  });
});
