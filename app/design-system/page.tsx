import type { Metadata } from "next";
import { DesignSystemShell } from "@/sections/design-system/DesignSystemShell";

export const metadata: Metadata = {
  title: "Rain Zhang — Design System",
  description:
    "The design tokens, typography, spacing, components, and tweaks that power the portfolio.",
};

export default function DesignSystemPage() {
  return (
    <div data-route="design-system">
      <DesignSystemShell />
    </div>
  );
}
