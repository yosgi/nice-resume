import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumeFeaturedSkill,
  ResumePDFProgressBar
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeSkills } from "lib/redux/types";

export const ResumePDFSkills = ({
  heading,
  skills,
  themeColor,
  showBulletPoints,
  customSpacing,
}: {
  heading: string;
  skills: ResumeSkills;
  themeColor: string;
  showBulletPoints: boolean;
  customSpacing?: number;
}) => {
  const { descriptions, featuredSkills } = skills;
  const featuredSkillsWithText = featuredSkills.filter((item) => item.skill);
  return (
    <ResumePDFSection 
      themeColor={themeColor} 
      heading={heading}
      customSpacing={customSpacing}
    >
      {descriptions.length > 0 && (
        <ResumePDFBulletList
          items={descriptions}
          showBulletPoints={showBulletPoints}
        />
      )}
      {featuredSkills.length > 0 && (
        <View style={{
          gap: spacing["2"],
          ...styles.flexCol,
        }}>
          {featuredSkills.map((featuredSkill, idx) => (
            <View
              key={idx}
              style={{
                ...styles.flexCol,
              }}
            >
              {
                featuredSkill.skill && (
                  <>
                    <ResumeFeaturedSkill
                      key={idx}
                      skill={featuredSkill.skill}
                      rating={featuredSkill.rating}
                      themeColor={themeColor}
                    />
                    <ResumePDFProgressBar
                      progress={featuredSkill.rating / 4 * 100}
                      themeColor={themeColor}
                    />
                  </>
                )
              }

            </View>
          ))}
        </View>
      )}

    </ResumePDFSection>
  );
};
