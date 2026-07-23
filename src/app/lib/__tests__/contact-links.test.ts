import {
  getFriendlyLinkText,
  getLinkHref,
  normalizeContactField,
} from "lib/contact-links";

describe("contact links", () => {
  it("uses a custom display name without changing the destination", () => {
    const url =
      "https://www.linkedin.com/in/a-very-long-profile-name-and-identifier";

    expect(getFriendlyLinkText(url, "Professional profile")).toBe(
      "Professional profile"
    );
    expect(getLinkHref(url)).toBe(url);
  });

  it("automatically shortens common profile URLs", () => {
    expect(
      getFriendlyLinkText("linkedin.com/in/a-very-long-profile-name")
    ).toBe("LinkedIn");
    expect(getFriendlyLinkText("https://github.com/a-long-user-name")).toBe(
      "GitHub"
    );
  });

  it("uses the hostname for other websites", () => {
    expect(
      getFriendlyLinkText(
        "https://portfolio.example.com/research/a-very-long-page"
      )
    ).toBe("portfolio.example.com");
  });

  it("normalizes legacy string and structured additional fields", () => {
    expect(normalizeContactField("legacy value")).toEqual({
      value: "legacy value",
      label: "",
    });
    expect(
      normalizeContactField({ value: "github.com/example", label: "Code" })
    ).toEqual({
      value: "github.com/example",
      label: "Code",
    });
  });
});
