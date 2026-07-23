import { addTextBreakOpportunities } from "lib/pdf-text-wrapping";

describe("PDF text wrapping", () => {
  it("adds deterministic line breaks to long uninterrupted text", () => {
    const value = "averylonglinkedinusernamewithnospaces";
    const result = addTextBreakOpportunities(value, 8);

    expect(result).toContain("\n");
    expect(result.replaceAll("\n", "")).toBe(value);
  });

  it("prefers natural URL and email boundaries after a useful line length", () => {
    const value = "firstname.lastname@example.com/profile?id=123";
    const result = addTextBreakOpportunities(value, 14);

    expect(result).toContain(".\n");
    expect(result.replaceAll("\n", "")).toBe(value);
  });

  it("leaves short text unchanged", () => {
    expect(addTextBreakOpportunities("ordinary", 14)).toBe("ordinary");
  });
});
