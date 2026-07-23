/**
 * @jest-environment node
 */

import fs from "fs";
import path from "path";
import { Font, renderToBuffer } from "@react-pdf/renderer";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { ResumePDF } from "components/Resume/ResumePDF";
import { normalizeImportedResumeState } from "lib/import-resume-state";
import type { Settings } from "lib/redux/settingsSlice";
import type { Resume } from "lib/redux/types";

type ResumeFixture = {
  resume: Resume;
  settings: Settings;
};

const fixturesDirectory = path.join(
  process.cwd(),
  "test-data",
  "extreme-resumes"
);
const fixtureFiles = fs
  .readdirSync(fixturesDirectory)
  .filter((fileName) => fileName.endsWith(".json"))
  .sort();

const expectedSentinelsByFile: Record<string, string[]> = {
  "01-long-unbroken-strings.json": [
    "AlexandertheGreatExtremelyLongProfessionalNameWithoutAnySpacesAtAll",
    "firstname.lastname.with.an.extremely.long.department@very-long-company-domain.example.com",
    "Professional profile",
    "Source code",
    "EnterpriseTransformationAndCustomerAnalyticsPlatformWithAnExtremelyLongProjectNameThatMustNeverOverlapTheDate",
    "January2024UntilDecember2026WithoutSpaces",
  ],
  "02-long-titles-and-dates.json": [
    "Director of Engineering for Customer Identity, Fraud Prevention, Privacy, Security, and Global Platform Operations",
    "September 2018 - February 2026 (full-time, remote, international)",
    "Global Developer Platform Migration and Reliability Improvement Initiative",
  ],
  "03-dense-sidebar-and-multilingual.json": [
    "平台工程师，专注于高可用系统、开发者体验、云基础设施与跨团队技术协作。",
    "跨团队技术领导力 Cross-Team Technical Leadership",
    "portfolio-backup.example.net",
  ],
  "04-multipage-dense-content.json": [
    "Led the design and rollout of a multi-region platform serving millions of requests while maintaining strict reliability and recovery objectives.",
    "Contributor to open-source reliability and developer tooling projects.",
  ],
  "05-symbols-empty-fields-and-maximum-font.json": [
    "example.com",
    "https://doi.org/10.1234/example.2026.123456789",
    "Research/Development & Quality Programme: Phase 1, Phase 2, and Long-Term Follow-Up",
  ],
  "06-featured-skills-only-legacy-settings.json": [
    "FeaturedSkillMustRemainVisibleEvenWithoutDescriptions",
  ],
};

const expectedLinkTargetsByFile: Partial<Record<string, string[]>> = {
  "01-long-unbroken-strings.json": [
    "https://www.linkedin.com/in/an-extremely-long-linkedin-profile-name-with-many-segments-and-identifiers",
    "https://github.com/organisation/repository-with-an-extremely-long-name-and-deep-path/tree/main/packages/application",
  ],
};

const normalizeText = (text: string) =>
  text.replace(/\s+/g, "").replace(/\u00ad/g, "");

Font.register({
  family: "NotoSansSC",
  fonts: [
    {
      src: path.join(process.cwd(), "public/fonts/NotoSansSC-Regular.ttf"),
      fontWeight: 400,
      fontStyle: "normal",
    },
    {
      src: path.join(process.cwd(), "public/fonts/NotoSansSC-Regular.ttf"),
      fontWeight: 400,
      fontStyle: "italic",
    },
    {
      src: path.join(process.cwd(), "public/fonts/NotoSansSC-Bold.ttf"),
      fontWeight: 700,
      fontStyle: "normal",
    },
    {
      src: path.join(process.cwd(), "public/fonts/NotoSansSC-Bold.ttf"),
      fontWeight: 700,
      fontStyle: "italic",
    },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

describe.each(fixtureFiles)("ResumePDF extreme JSON: %s", (fixtureFile) => {
  it("renders complete text without crossing page bounds", async () => {
    const importedFixture = JSON.parse(
      fs.readFileSync(path.join(fixturesDirectory, fixtureFile), "utf8")
    ) as ResumeFixture;
    const fixture = normalizeImportedResumeState(importedFixture);
    const pdfBuffer = await renderToBuffer(
      <ResumePDF
        resume={fixture.resume}
        settings={fixture.settings}
        isPDF={true}
      />
    );
    if (process.env.WRITE_EXTREME_PDFS === "1") {
      const outputDirectory = path.join(
        process.cwd(),
        "tmp",
        "pdfs",
        "extreme-resumes"
      );
      fs.mkdirSync(outputDirectory, { recursive: true });
      fs.writeFileSync(
        path.join(outputDirectory, fixtureFile.replace(/\.json$/, ".pdf")),
        pdfBuffer
      );
    }
    const pdfjs = await import("pdfjs-dist");
    const pdfDocument = await pdfjs.getDocument({
      data: new Uint8Array(pdfBuffer),
      standardFontDataUrl: path.join(
        process.cwd(),
        "node_modules/pdfjs-dist/standard_fonts/"
      ),
    }).promise;
    const extractedText: string[] = [];
    const linkTargets: string[] = [];

    if (fixtureFile === "04-multipage-dense-content.json") {
      expect(pdfDocument.numPages).toBeGreaterThan(1);
    }

    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
      const page = await pdfDocument.getPage(pageNumber);
      const pageWidth = page.view[2];
      const pageHeight = page.view[3];
      const textContent = await page.getTextContent();
      const annotations = await page.getAnnotations();
      linkTargets.push(
        ...annotations
          .map((annotation) => annotation.url)
          .filter((url): url is string => Boolean(url))
      );
      const textItems = textContent.items.filter(
        (item): item is TextItem => "str" in item
      );
      for (const item of textItems) {
        const left = item.transform[4];
        const baseline = item.transform[5];
        const right = left + item.width;

        extractedText.push(item.str);
        expect(left).toBeGreaterThanOrEqual(-0.5);
        expect(right).toBeLessThanOrEqual(pageWidth + 0.5);
        expect(baseline).toBeGreaterThanOrEqual(-0.5);
        expect(baseline).toBeLessThanOrEqual(pageHeight + 0.5);
      }
    }

    const normalizedExtractedText = normalizeText(extractedText.join(""));
    for (const sentinel of expectedSentinelsByFile[fixtureFile]) {
      expect(normalizedExtractedText).toContain(normalizeText(sentinel));
    }
    for (const target of expectedLinkTargetsByFile[fixtureFile] || []) {
      expect(linkTargets).toContain(target);
    }

    if (fixtureFile === "01-long-unbroken-strings.json") {
      expect(
        normalizedExtractedText.indexOf("Professionalprofile")
      ).toBeLessThan(normalizedExtractedText.indexOf("Sourcecode"));
      expect(normalizedExtractedText.indexOf("Sourcecode")).toBeLessThan(
        normalizedExtractedText.indexOf(
          "firstname.lastname.with.an.extremely.long.department"
        )
      );
    }
  });
});
