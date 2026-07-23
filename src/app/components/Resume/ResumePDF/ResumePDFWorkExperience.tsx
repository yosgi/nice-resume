import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
  ResumePDFTitleDateRow,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeWorkExperience } from "lib/redux/types";

export const ResumePDFWorkExperience = ({
  heading,
  workExperiences,
  themeColor,
  customSpacing,
}: {
  heading: string;
  workExperiences: ResumeWorkExperience[];
  themeColor: string;
  customSpacing?: number;
}) => {
  return (
    <ResumePDFSection
      themeColor={themeColor}
      heading={workExperiences.length > 0 ? heading : ""}
      customSpacing={customSpacing}
    >
      <View style={styles.flexCol}>
        {workExperiences.map(
          (
            { company, jobTitle, date, descriptions, spacing: itemSpacing },
            idx
          ) => {
            // Hide company name if it is the same as the previous company
            const hideCompanyName =
              idx > 0 && company === workExperiences[idx - 1].company;
            return (
              <View
                key={idx}
                style={{
                  marginBottom: `${itemSpacing ?? 6}pt`,
                }}
              >
                {!hideCompanyName && (
                  <ResumePDFText bold={true}>{company}</ResumePDFText>
                )}
                <ResumePDFTitleDateRow
                  title={jobTitle}
                  date={date}
                  dateStyle={{
                    fontStyle: "italic",
                    color: "#525252",
                  }}
                  style={{
                    marginTop: hideCompanyName
                      ? "-" + spacing["1"]
                      : spacing["1.5"],
                  }}
                />
                <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
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
