import { View } from "@react-pdf/renderer";
import {
  ResumePDFBulletList,
  ResumePDFSection,
  ResumePDFText,
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
      {educations.map(
        ({ school, degree, date, gpa, descriptions = [] }, idx) => {
          // Hide school name if it is the same as the previous school
          const hideSchoolName =
            idx > 0 && school === educations[idx - 1].school;
          const showDescriptions = descriptions.join() !== "";

          return (
            <View key={idx}>
              {!hideSchoolName && (
                <ResumePDFText bold={true}>{school}</ResumePDFText>
              )}
              <View
                style={{
                  ...styles.flexRowBetween,
                  marginTop: hideSchoolName
                    ? "-" + spacing["1"]
                    : spacing["1.5"],
                }}
              >
                <View style={{ flex: 1, maxWidth: "70%" }}>
                  <ResumePDFText>{`${
                    gpa
                      ? `${degree} - ${Number(gpa) ? gpa + " GPA" : gpa}`
                      : degree
                  }`}</ResumePDFText>
                </View>
                <View style={{ marginLeft: spacing["2"] }}>
                  <ResumePDFText style={{
                    color: "#525252"
                  }}>{date}</ResumePDFText>
                </View>
              </View>
              {showDescriptions && (
                <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
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
    </ResumePDFSection>
  );
};
