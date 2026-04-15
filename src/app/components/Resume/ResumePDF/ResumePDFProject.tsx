import { View } from "@react-pdf/renderer";
import {
  addTextBreakOpportunities,
  ResumePDFLink,
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeProject } from "lib/redux/types";

export const ResumePDFProject = ({
  heading,
  projects,
  themeColor,
  customSpacing,
  isPDF,
}: {
  heading: string;
  projects: ResumeProject[];
  themeColor: string;
  customSpacing?: number;
  isPDF: boolean;
}) => {
  return (
    <ResumePDFSection
      themeColor={themeColor}
      heading={heading}
      customSpacing={customSpacing}
    >
      {projects.map(({ project, date, linkName, url, descriptions }, idx) => {
        const link = url
          ? url.startsWith("http")
            ? url
            : `https://${url}`
          : "";
        const linkText = linkName || url;
        const projectUrl = (
          <ResumePDFText style={{ fontSize: "9pt" }}>
            {addTextBreakOpportunities(linkText, 20)}
          </ResumePDFText>
        );

        return (
          <View key={idx}>
            <View
              style={{
                ...styles.flexRowBetween,
                marginTop: spacing["0.5"],
              }}
            >
              <ResumePDFText bold={true}>
                {addTextBreakOpportunities(project, 20)}
              </ResumePDFText>
              <ResumePDFText>{date}</ResumePDFText>
            </View>
            {link && isPDF && (
              <ResumePDFLink src={link} isPDF={isPDF}>
                {projectUrl}
              </ResumePDFLink>
            )}
            {link && !isPDF && projectUrl}
            <View style={{ ...styles.flexCol, marginTop: spacing["0.5"] }}>
              <ResumePDFBulletList items={descriptions} />
            </View>
          </View>
        );
      })}
    </ResumePDFSection>
  );
};
