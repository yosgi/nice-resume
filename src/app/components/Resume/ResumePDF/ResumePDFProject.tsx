import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFTitleDateRow,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeProject } from "lib/redux/types";

export const ResumePDFProject = ({
  heading,
  projects,
  themeColor,
  customSpacing,
}: {
  heading: string;
  projects: ResumeProject[];
  themeColor: string;
  customSpacing?: number;
}) => {
  return (
    <ResumePDFSection
      themeColor={themeColor}
      heading={heading}
      customSpacing={customSpacing}
    >
      <View style={styles.flexCol}>
        {projects.map(
          ({ project, date, descriptions, spacing: itemSpacing }, idx) => (
            <View key={idx} style={{ marginBottom: `${itemSpacing ?? 6}pt` }}>
              <ResumePDFTitleDateRow
                title={project}
                date={date}
                titleBold={true}
                style={{ marginTop: spacing["0.5"] }}
              />
              <View style={{ ...styles.flexCol, marginTop: spacing["0.5"] }}>
                <ResumePDFBulletList items={descriptions} />
              </View>
            </View>
          )
        )}
      </View>
    </ResumePDFSection>
  );
};
