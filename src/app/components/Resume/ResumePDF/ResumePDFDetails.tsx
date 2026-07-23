import { View } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import {
  addTextBreakOpportunities,
  ResumePDFLink,
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import type { ResumeProfile } from "lib/redux/types";
import { useTranslation } from "../../../../../utils/translations";
import {
  getFriendlyLinkText,
  getLinkHref,
  isLikelyUrl,
  normalizeContactField,
} from "lib/contact-links";
import { getContactOrder } from "lib/contact-order";

export const ResumePDFDetails = ({
  profile,
  themeColor,
  isPDF,
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
}) => {
  const { email, phone, url, urlLabel, location, additionalFields } = profile;
  const contactItems = new Map<
    string,
    { value: string; visibleValue: string; src?: string }
  >([
    ["email", { value: email, visibleValue: email, src: `mailto:${email}` }],
    [
      "phone",
      {
        value: phone,
        visibleValue: phone,
        src: `tel:${phone.replace(/[^\d+]/g, "")}`,
      },
    ],
    [
      "url",
      {
        value: url,
        visibleValue: getFriendlyLinkText(url, urlLabel),
        src: getLinkHref(url),
      },
    ],
    ["location", { value: location, visibleValue: location }],
  ]);

  additionalFields.forEach((field, idx) => {
    const { value, label } = normalizeContactField(field);
    const isUrl = isLikelyUrl(value);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    contactItems.set(`additional-${idx}`, {
      value,
      visibleValue: isUrl
        ? getFriendlyLinkText(value, label)
        : label
        ? `${label}: ${value}`
        : value,
      src: isEmail ? `mailto:${value}` : isUrl ? getLinkHref(value) : undefined,
    });
  });

  const { t } = useTranslation();
  return (
    <ResumePDFSection
      style={{ marginTop: spacing["40"] }}
      heading={t("resume.contact")}
    >
      <View
        style={{
          ...styles.flexCol,
          gap: spacing["2"],
          width: "100%",
        }}
      >
        {getContactOrder(profile).map((key) => {
          const item = contactItems.get(key);
          if (!item?.value) return null;

          const { visibleValue, src } = item;
          const displayText = addTextBreakOpportunities(visibleValue);

          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            if (!src) return <>{children}</>;

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
                width: "100%",
                maxWidth: "100%",
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
