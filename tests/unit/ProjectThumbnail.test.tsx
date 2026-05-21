import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ProjectThumbnail } from "@/components/atoms/ProjectThumbnail";

describe("ProjectThumbnail", () => {
  it("renders no img when no image prop is provided", () => {
    const { container } = render(<ProjectThumbnail />);
    expect(container.querySelector("img")).toBeNull();
  });

  it("renders an img with src/alt/loading/decoding when an image is provided", () => {
    const { container } = render(
      <ProjectThumbnail image="/projects/x.png" alt="Project X preview" />
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe("/projects/x.png");
    expect(img?.getAttribute("alt")).toBe("Project X preview");
    expect(img?.getAttribute("loading")).toBe("lazy");
    expect(img?.getAttribute("decoding")).toBe("async");
  });

  it("keeps the 16:9 aspect ratio container class even without an image", () => {
    const { container } = render(<ProjectThumbnail />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("aspect-[16/9]");
  });
});
