import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Contact } from "@/sections/portfolio/Contact";

describe("Contact form", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn(async () => new Response(null, { status: 200 })) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("does not POST when submitted empty", async () => {
    render(<Contact />);
    const form = screen.getByRole("button", { name: /Send message/i }).closest("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("shows an inline error for malformed email after the user types into it", async () => {
    const user = userEvent.setup();
    render(<Contact />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    await user.type(emailInput, "not-an-email");
    expect(await screen.findByText("Invalid email")).toBeInTheDocument();
  });

  it("POSTs to Formspree with form payload and shows success state", async () => {
    const user = userEvent.setup();
    render(<Contact />);
    await user.type(screen.getByPlaceholderText("Your name"), "Rain");
    await user.type(screen.getByPlaceholderText("you@example.com"), "rain@example.com");
    await user.type(screen.getByPlaceholderText("What are you working on?"), "Hi there");
    await user.click(screen.getByRole("button", { name: /Send message/i }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });
    const [url, init] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("https://formspree.io/f/xoveaaqo");
    expect((init as RequestInit).method).toBe("POST");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toEqual({ name: "Rain", email: "rain@example.com", message: "Hi there" });

    expect(await screen.findByText("Message sent.")).toBeInTheDocument();
  });
});
