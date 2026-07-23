import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFLink,
  ResumePDFText,
  ResumePDFTitleDateRow,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { getLinkHref } from "lib/contact-links";
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
      <View style={styles.flexCol}>
        {projects.map(
          (
            {
              project,
              date,
              linkName = "",
              url = "",
              descriptions,
              spacing: itemSpacing,
            },
            idx
          ) => {
            const trimmedUrl = url.trim();
            const linkText = linkName.trim() || trimmedUrl;

            return (
              <View key={idx} style={{ marginBottom: `${itemSpacing ?? 6}pt` }}>
                <ResumePDFTitleDateRow
                  title={project}
                  date={date}
                  titleBold={true}
                  style={{ marginTop: spacing["0.5"] }}
                />
                {Boolean(trimmedUrl) && (
                  <ResumePDFLink src={getLinkHref(trimmedUrl)} isPDF={isPDF}>
                    <ResumePDFText
                      maxSegmentLength={20}
                      style={{
                        color: themeColor,
                        fontSize: "9pt",
                        marginTop: spacing["0.5"],
                      }}
                    >
                      {linkText}
                    </ResumePDFText>
                  </ResumePDFLink>
                )}
                <View style={{ ...styles.flexCol, marginTop: spacing["0.5"] }}>
                  <ResumePDFBulletList items={descriptions} />
                </View>
              </View>
            );
          }
        )}
      </View>
    </ResumePDFSection>
  );
};
