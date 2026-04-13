import { View } from "@react-pdf/renderer";
import { type IconType } from "components/Resume/ResumePDF/common/ResumePDFIcon";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import {
  addTextBreakOpportunities,
  ResumePDFLink,
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import type { ResumeProfile } from "lib/redux/types";
import { useTranslation } from "../../../../../utils/translations";

export const ResumePDFDetails = ({
  profile,
  themeColor,
  isPDF,
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
}) => {
  const { name, email, phone, url, summary, location, additionalFields } = profile;
  const iconProps = { email, phone, location, url };
  
  const { t } = useTranslation();
  return (
    <ResumePDFSection style={{ marginTop: spacing["40"] }}
    heading={t("resume.contact")}>
      <View
        style={{
          ...styles.flexCol,
          flexWrap: "wrap",
          gap: spacing["2"],
          width: "100%",
        }}
      >
        
        {Object.entries(iconProps).map(([key, value]) => {
          if (!value || typeof value !== "string") return null;

          let iconType = key as IconType;
          if (key === "url") {
            if (value.includes("github")) {
              iconType = "url_github";
            } else if (value.includes("linkedin")) {
              iconType = "url_linkedin";
            }
          }

          const shouldUseLinkWrapper = ["phone", "url","email" ].includes(key);
          const displayText = addTextBreakOpportunities(value);
          
          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            if (!shouldUseLinkWrapper) return <>{children}</>;

            let src = "";
            switch (key) {
              case "email": {
                src = `mailto:${value}`; // Use original value for href
                break;
              }
              case "phone": {
                src = `tel:${value.replace(/[^\d+]/g, "")}`; // Keep only + and digits, use original value
                break;
              }
              default: {
                src = value.startsWith("http") ? value : `https://${value}`; // Use original value for href
              }
            }

            return (
              <ResumePDFLink src={src} isPDF={isPDF}>
                {children}
              </ResumePDFLink>
            );
          };

          return (
            <View
              key={key}
              style={{
                width: "120pt",
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <View style={{ flexGrow: 1, flexBasis: 0, width: "100%" }}>
                <Wrapper>
                  <ResumePDFText
                    style={{
                      color: "white",
                      width: "100%",
                    }}
                  >
                    {displayText}
                  </ResumePDFText>
                </Wrapper>
              </View>
            </View>
          );
        })}
        {additionalFields.map((value, idx) => {
          if (!value || typeof value !== "string") return null;
          
          const displayText = addTextBreakOpportunities(value);
          const isUrl = value.includes("http") || value.includes("www.") || value.includes(".");
          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            if (!isUrl) return <>{children}</>;
            const src = value.startsWith("http") ? value : `https://${value}`; // Use original value for href
            return (
              <ResumePDFLink src={src} isPDF={isPDF}>
                {children}
              </ResumePDFLink>
            );
          };

          return (
            <View
              key={`additional-${idx}`}
              style={{
                width: "120pt",
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <View style={{ flexGrow: 1, flexBasis: 0, width: "100%" }}>
                <Wrapper>
                  <ResumePDFText
                    style={{
                      color: "white",
                      width: "100%",
                    }}
                  >
                    {displayText}
                  </ResumePDFText>
                </Wrapper>
              </View>
            </View>
          );
        })}
      </View>
    </ResumePDFSection>
  );
};
