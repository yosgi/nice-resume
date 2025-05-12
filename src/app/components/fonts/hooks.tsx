import { useEffect } from "react";
import { Font } from "@react-pdf/renderer";
import { ENGLISH_FONT_FAMILIES, NON_ENGLISH_FONT_FAMILIES } from "components/fonts/constants";
import { getAllFontFamiliesToLoad } from "components/fonts/lib";

/**
 * Register all fonts to React PDF so it can render fonts correctly in PDF
 */
export const useRegisterReactPDFFont = () => {
  useEffect(() => {
    const allFontFamilies = [...ENGLISH_FONT_FAMILIES, ...NON_ENGLISH_FONT_FAMILIES];
    // Register all fonts
    allFontFamilies.forEach((fontFamily) => {
      Font.register({
        family: fontFamily,
        fonts: [
          {
            src: `/fonts/${fontFamily}-Regular.ttf`,
            fontWeight: 400,
            fontStyle: "normal",
          },
          {
            src: `/fonts/${fontFamily}-Bold.ttf`,
            fontWeight: 700,
            fontStyle: "normal",
          },
          {
            src: `/fonts/${fontFamily}-Regular.ttf`, // Using Regular for italic as fallback
            fontWeight: 400,
            fontStyle: "italic",
          },
          {
            src: `/fonts/${fontFamily}-Bold.ttf`, // Using Bold for italic as fallback
            fontWeight: 700,
            fontStyle: "italic",
          },
        ],
      });
    });
  }, []);
};

export const useRegisterReactPDFHyphenationCallback = (fontFamily: string) => {
  useEffect(() => {
    // Disable hyphenation for English Font Family so the word wraps each line
    // https://github.com/diegomura/react-pdf/issues/311#issuecomment-548301604
    Font.registerHyphenationCallback((word) => [word]);
  }, [fontFamily]);
};