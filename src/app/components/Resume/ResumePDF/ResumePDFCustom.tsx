import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
} from "components/Resume/ResumePDF/common";
import { styles } from "components/Resume/ResumePDF/styles";
import type { ResumeCustom } from "lib/redux/types";

export const ResumePDFCustom = ({
  heading,
  custom,
  themeColor,
  showBulletPoints,
  customSpacing,
}: {
  heading: string;
  custom: ResumeCustom;
  themeColor: string;
  showBulletPoints: boolean;
  customSpacing?: number;
}) => {
  const { descriptions } = custom;

  return (
    <ResumePDFSection 
      themeColor={themeColor} 
      heading={heading}
      customSpacing={customSpacing}
    >
      <View style={{ ...styles.flexCol }}>
        <ResumePDFBulletList
          items={descriptions}
          showBulletPoints={showBulletPoints}
        />
      </View>
    </ResumePDFSection>
  );
};
