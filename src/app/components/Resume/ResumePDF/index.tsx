"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Page, View, Document } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { ResumePDFWorkExperience } from "components/Resume/ResumePDF/ResumePDFWorkExperience";
import { ResumePDFEducation } from "components/Resume/ResumePDF/ResumePDFEducation";
import { ResumePDFProject } from "components/Resume/ResumePDF/ResumePDFProject";
import { ResumePDFSkills } from "components/Resume/ResumePDF/ResumePDFSkills";
import { ResumePDFCustom } from "components/Resume/ResumePDF/ResumePDFCustom";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import type { Settings, ShowForm } from "lib/redux/settingsSlice";
import type { Resume } from "lib/redux/types";
import { SuppressResumePDFErrorMessage } from "components/Resume/ResumePDF/common/SuppressResumePDFErrorMessage";
import { ResumePDFDetails } from "components/Resume/ResumePDF/ResumePDFDetails";
import { LanguageProvider } from "../../../../../contexts/LanguageContext";
import { A4_HEIGHT_PX, LETTER_HEIGHT_PX, PX_PER_PT } from "lib/constants";

/**
 * Note: ResumePDF is supposed to be rendered inside PDFViewer. However,
 * PDFViewer is rendered too slow and has noticeable delay as you enter
 * the resume form, so we render it without PDFViewer to make it render
 * instantly. There are 2 drawbacks with this approach:
 * 1. Not everything works out of box if not rendered inside PDFViewer,
 *    e.g. svg doesn't work, so it takes in a isPDF flag that maps react
 *    pdf element to the correct dom element.
 * 2. It throws a lot of errors in console log, e.g. "<VIEW /> is using incorrect
 *    casing. Use PascalCase for React components, or lowercase for HTML elements."
 *    in development, causing a lot of noises. We can possibly workaround this by
 *    mapping every react pdf element to a dom element, but for now, we simply
 *    suppress these messages in <SuppressResumePDFErrorMessage />.
 *    https://github.com/diegomura/react-pdf/issues/239#issuecomment-487255027
 */

// Page break indicator component
const PageBreakIndicator = ({ top }: { top: string }) => (
  <View
    style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      height: "2pt",
      backgroundColor: "#ff0000",
      opacity: 0.3,
      zIndex: 1,
    }}
  />
);

export const ResumePDF = ({
  resume,
  settings,
  isPDF = false,
}: {
  resume: Resume;
  settings: Settings;
  isPDF?: boolean;
}) => {
  const { profile, workExperiences, educations, projects, skills, custom } =
    resume;
  const { name } = profile;
  const {
    fontFamily,
    fontSize,
    documentSize,
    formToHeading,
    formToShow,
    formsOrder,
    showBulletPoints,
  } = settings;
  const themeColor = settings.themeColor || DEFAULT_FONT_COLOR;

  const pageHeightPt = useMemo(
    () =>
      (documentSize === "A4" ? A4_HEIGHT_PX : LETTER_HEIGHT_PX) / PX_PER_PT,
    [documentSize]
  );
  const [pageCount, setPageCount] = useState(1);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (isPDF || !contentRef.current) {
      return;
    }
    const contentHeightPx =
      contentRef.current.getBoundingClientRect().height;
    const contentHeightPt = contentHeightPx / PX_PER_PT;
    const nextPageCount = Math.max(
      1,
      Math.ceil(contentHeightPt / pageHeightPt)
    );
    if (nextPageCount !== pageCount) {
      setPageCount(nextPageCount);
    }
  }, [isPDF, pageCount, pageHeightPt, resume, settings]);

  const showFormsOrder = formsOrder.filter((form) => formToShow[form]);

  const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
    workExperiences: () => (
      <ResumePDFWorkExperience
        heading={formToHeading["workExperiences"]}
        workExperiences={workExperiences}
        themeColor={themeColor}
        customSpacing={settings.sectionSpacing.workExperiences}
      />
    ),
    educations: () => (
      <ResumePDFEducation
        heading={formToHeading["educations"]}
        educations={educations}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["educations"]}
        customSpacing={settings.sectionSpacing.educations}
      />
    ),
    projects: () => (
      <ResumePDFProject
        heading={formToHeading["projects"]}
        projects={projects}
        themeColor={themeColor}
        customSpacing={settings.sectionSpacing.projects}
      />
    ),
    skills: () => <></>,
    custom: () => (
      <ResumePDFCustom
        heading={formToHeading["custom"]}
        custom={custom}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints["custom"]}
        customSpacing={settings.sectionSpacing.custom}
      />
    ),
  };

  return (
    <LanguageProvider>
      <Document title={`${name} Resume`} author={name} producer={"OpenResume"}>
        <Page
          size={documentSize === "A4" ? "A4" : "LETTER"}
          style={{
            color: DEFAULT_FONT_COLOR,
            fontFamily,
            fontSize: fontSize + "pt",
            position: "relative",
            minHeight: !isPDF ? `${pageCount * pageHeightPt}pt` : undefined,
          }}
        >
          <View
            ref={contentRef as any}
            style={{
              ...styles.flexRow,
            }}
          >
            <View
              style={{
                ...styles.flexCol,
                padding: `${spacing[0]} ${spacing[20]}`,
                marginTop: spacing[10],
                flex: 2,
              }}
            >
              <ResumePDFProfile
                profile={profile}
                themeColor={themeColor}
                isPDF={isPDF}
              />
              {showFormsOrder.map((form) => {
                const Component = formTypeToComponent[form];
                return <Component key={form} />;
              })}
            </View>
            <View
              style={{
                backgroundColor: themeColor,
                color: "white",
                minHeight: !isPDF ? `${pageCount * pageHeightPt}pt` : "100vh",
                width: "150pt", // Fixed width for right sidebar
                padding: `${0} ${spacing["5"]}`,
                position: "relative",
              }}
            >
              <ResumePDFDetails
                profile={profile}
                themeColor={themeColor}
                isPDF={isPDF}
              />
              {formToShow["skills"] && (
                <ResumePDFSkills
                  heading={formToHeading["skills"]}
                  skills={skills}
                  themeColor={themeColor}
                  showBulletPoints={showBulletPoints["skills"]}
                  customSpacing={settings.sectionSpacing.skills}
                />
              )}
            </View>
          </View>
          {!isPDF &&
            Array.from({ length: pageCount }, (_, index) => (
              <PageBreakIndicator
                key={`page-break-${index}`}
                top={`${pageHeightPt * (index + 1)}pt`}
              />
            ))}
        </Page>
      </Document>
      <SuppressResumePDFErrorMessage />
    </LanguageProvider>
  );
};
