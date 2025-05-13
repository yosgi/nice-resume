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
const PageBreakIndicator = ({ documentSize }: { documentSize: string }) => (
  <View
    style={{
      position: "absolute",
      top: documentSize === "A4" ? "842pt" : "792pt", // A4: 842pt, Letter: 792pt
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
            ...styles.flexRow,
            color: DEFAULT_FONT_COLOR,
            fontFamily,
            fontSize: fontSize + "pt",
            position: "relative",
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
              minHeight: "100vh",
              flex: 1,
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
          {!isPDF && <PageBreakIndicator documentSize={documentSize} />}
        </Page>
      </Document>
      <SuppressResumePDFErrorMessage />
    </LanguageProvider>
  );
};