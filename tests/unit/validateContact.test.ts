import { describe, expect, it } from "vitest";
import { validateContact } from "@/lib/utils/validateContact";

describe("validateContact", () => {
  it("flags an empty name as required", () => {
    const errors = validateContact({ name: "", email: "a@b.co", message: "hi" });
    expect(errors.name).toBe("required");
  });

  it("flags an empty email as required", () => {
    const errors = validateContact({ name: "Rain", email: "", message: "hi" });
    expect(errors.email).toBe("required");
  });

  it("flags an invalid email format", () => {
    const errors = validateContact({ name: "Rain", email: "not-an-email", message: "hi" });
    expect(errors.email).toBe("invalid-email");
  });

  it("flags an empty message as required", () => {
    const errors = validateContact({ name: "Rain", email: "a@b.co", message: "   " });
    expect(errors.message).toBe("required");
  });

  it("returns null errors for a valid submission", () => {
    const errors = validateContact({
      name: "Rain Zhang",
      email: "rain@example.com",
      message: "Hello there!",
    });
    expect(errors).toEqual({ name: null, email: null, message: null });
  });

  it("trims whitespace before validating", () => {
    const errors = validateContact({ name: "  ", email: "  ", message: "  " });
    expect(errors.name).toBe("required");
    expect(errors.email).toBe("required");
    expect(errors.message).toBe("required");
  });
});
