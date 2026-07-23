import { View } from "@react-pdf/renderer";
import {
  ResumePDFBulletList,
  ResumePDFSection,
  ResumePDFText,
  ResumePDFTitleDateRow,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeEducation } from "lib/redux/types";

export const ResumePDFEducation = ({
  heading,
  educations,
  themeColor,
  showBulletPoints,
  customSpacing,
}: {
  heading: string;
  educations: ResumeEducation[];
  themeColor: string;
  showBulletPoints: boolean;
  customSpacing?: number;
}) => {
  return (
    <ResumePDFSection
      themeColor={themeColor}
      heading={heading}
      customSpacing={customSpacing}
    >
      <View style={styles.flexCol}>
        {educations.map(
          (
            {
              school,
              degree,
              date,
              gpa,
              descriptions = [],
              spacing: itemSpacing,
            },
            idx
          ) => {
            // Hide school name if it is the same as the previous school
            const hideSchoolName =
              idx > 0 && school === educations[idx - 1].school;
            const showDescriptions = descriptions.join() !== "";

            return (
              <View key={idx} style={{ marginBottom: `${itemSpacing ?? 6}pt` }}>
                {!hideSchoolName && (
                  <ResumePDFText bold={true}>{school}</ResumePDFText>
                )}
                <ResumePDFTitleDateRow
                  title={
                    gpa
                      ? `${degree} - ${Number(gpa) ? gpa + " GPA" : gpa}`
                      : degree
                  }
                  date={date}
                  dateStyle={{ color: "#525252" }}
                  style={{
                    marginTop: hideSchoolName
                      ? "-" + spacing["1"]
                      : spacing["1.5"],
                  }}
                />
                {showDescriptions && (
                  <View
                    style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}
                  >
                    <ResumePDFBulletList
                      items={descriptions}
                      showBulletPoints={showBulletPoints}
                    />
                  </View>
                )}
              </View>
            );
          }
        )}
      </View>
    </ResumePDFSection>
  );
};
