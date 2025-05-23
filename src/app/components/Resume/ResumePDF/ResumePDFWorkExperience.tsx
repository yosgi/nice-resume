import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
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
      heading={workExperiences.length > 0 ? heading: ""}
      customSpacing={customSpacing}
    >
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        // Hide company name if it is the same as the previous company
        const hideCompanyName =
          idx > 0 && company === workExperiences[idx - 1].company;
        return (
          <View 
            key={idx} 
            style={{
              ...(idx !== 0 ? { marginTop: spacing["2"] } : {})
            }}
          >
            {!hideCompanyName && (
              <ResumePDFText bold={true}>{company}</ResumePDFText>
            )}
            <View
              style={{
                ...styles.flexRowBetween,
                marginTop: hideCompanyName
                  ? "-" + spacing["1"]
                  : spacing["1.5"],
              }}
            >
              <View style={{ flex: 1, maxWidth: "70%" }}>
                <ResumePDFText>{jobTitle}</ResumePDFText>
              </View>
              <View style={{ marginLeft: spacing["2"] }}>
                <ResumePDFText style={{
                  fontStyle: "italic",
                  color:"#525252"
                }}>{date}</ResumePDFText>
              </View>
            </View>
            <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
              <ResumePDFBulletList items={descriptions} />
            </View>
          </View>
        );
      })}
    </ResumePDFSection>
  );
};
