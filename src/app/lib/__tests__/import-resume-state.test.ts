import featuredSkillsOnlyFixture from "../../../../test-data/extreme-resumes/06-featured-skills-only-legacy-settings.json";
import {
  getImportedSectionVisibility,
  normalizeImportedResumeState,
} from "lib/import-resume-state";

describe("normalizeImportedResumeState", () => {
  it("fills fields missing from legacy or partial JSON files", () => {
    const { resume, settings } = normalizeImportedResumeState(
      featuredSkillsOnlyFixture
    );

    expect(resume.profile.additionalFields).toEqual([]);
    expect(resume.skills.descriptions).toEqual([]);
    expect(settings.formToShow.skills).toBe(true);
    expect(settings.sectionSpacing.skills).toBeDefined();
    expect(settings.formsOrder).toContain("skills");
  });

  it("keeps a featured-skills-only section visible", () => {
    const { resume } = normalizeImportedResumeState(featuredSkillsOnlyFixture);

    expect(getImportedSectionVisibility(resume).skills).toBe(true);
  });

  it("rejects JSON without a resume object", () => {
    expect(() => normalizeImportedResumeState({ settings: {} })).toThrow(
      "valid resume object"
    );
  });
});
