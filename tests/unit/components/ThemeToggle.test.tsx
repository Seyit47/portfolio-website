import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("cycles system -> light -> dark -> system and describes its state", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeToggle />
      </ThemeProvider>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Theme: System, switch to Light");
    await user.click(button);
    expect(button).toHaveAttribute("aria-label", "Theme: Light, switch to Dark");
    expect(localStorage.getItem("theme")).toBe("light");
    await user.click(button);
    expect(button).toHaveAttribute("aria-label", "Theme: Dark, switch to System");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    await user.click(button);
    expect(button).toHaveAttribute("aria-label", "Theme: System, switch to Light");
  });
});
