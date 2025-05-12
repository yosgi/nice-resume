/**
 * Adding a new font family involves 4 steps:
 * Step 1. Add it to one of the below FONT_FAMILIES variable array:
 *         English fonts -> SANS_SERIF_ENGLISH_FONT_FAMILIES or SERIF_ENGLISH_FONT_FAMILIES
 *         Non-English fonts -> NON_ENGLISH_FONT_FAMILIES
 *         Once the font is added, it would take care of
 *         a. Registering font family for React PDF at "components/fonts/hooks.tsx"
 *         b. Loading font family for React PDF iframe at "components/Resume/ResumeIFrame.tsx"
 *         c. Adding font family selection to Resume Settings at "components/ResumeForm/ThemeForm/Selection.tsx"
 * Step 2. To load css correctly for the Resume Form:
 *         English fonts -> add it to the "public\fonts\fonts.css" file
 *         Non-English fonts -> create/update "public\fonts\fonts-<language>.css" and update "components/fonts/NonEnglishFontsCSSLazyLoader.tsx"
 * Step 3. Update FONT_FAMILY_TO_STANDARD_SIZE_IN_PT and FONT_FAMILY_TO_DISPLAY_NAME accordingly
 * Step 4. Update "public/fonts/OFL.txt" to include the new font family and credit the font creator
 *
 * IMPORTANT NOTE:
 * One major problem with adding a new font family is that most font family doesn't work with
 * React PDF out of box. The texts would appear fine in the PDF, but copying and pasting them
 * would result in different texts. See issues: https://github.com/diegomura/react-pdf/issues/915
 * and https://github.com/diegomura/react-pdf/issues/629
 *
 * A solution to this problem is to import and re-export the font with a font editor, e.g. fontforge or birdfont.
 *
 * If using fontforge, the following command can be used to export the font:
 * ./fontforge -lang=ff -c 'Open($1); Generate($2); Close();' old_font.ttf new_font.ttf
 * Note that fontforge doesn't work on non-english fonts: https://github.com/fontforge/fontforge/issues/1534
 * Also, some fonts might still not work after re-export.
 */

const SANS_SERIF_ENGLISH_FONT_FAMILIES = [
  "Helvetica",
  "Roboto",
] as const;

const SERIF_ENGLISH_FONT_FAMILIES = [
  "Times-Roman",
  "Merriweather",
] as const;

const MONOSPACE_ENGLISH_FONT_FAMILIES = [
  "Courier",
] as const;

export const ENGLISH_FONT_FAMILIES = [
  ...SANS_SERIF_ENGLISH_FONT_FAMILIES,
  ...SERIF_ENGLISH_FONT_FAMILIES,
  ...MONOSPACE_ENGLISH_FONT_FAMILIES,
] as const;
type EnglishFontFamily = (typeof ENGLISH_FONT_FAMILIES)[number];

export const NON_ENGLISH_FONT_FAMILIES = [] as const;
type NonEnglishFontFamily = (typeof NON_ENGLISH_FONT_FAMILIES)[number];

export const NON_ENGLISH_FONT_FAMILY_TO_LANGUAGE: Record<
  NonEnglishFontFamily,
  string[]
> = {};

export type FontFamily = EnglishFontFamily | NonEnglishFontFamily;
export const FONT_FAMILY_TO_STANDARD_SIZE_IN_PT: Record<FontFamily, number> = {
  // Sans Serif Fonts
  Helvetica: 11,
  Roboto: 11,
  // Serif Fonts
  "Times-Roman": 11,
  Merriweather: 11,
  // Monospace Fonts
  Courier: 11,
};

export const FONT_FAMILY_TO_DISPLAY_NAME: Record<FontFamily, string> = {
  // Sans Serif Fonts
  Helvetica: "Helvetica",
  Roboto: "Roboto",
  // Serif Fonts
  "Times-Roman": "Times-Roman",
  Merriweather: "Merriweather",
  // Monospace Fonts
  Courier: "Courier",
};

export const DEFAULT_FONT_FAMILY = "Merriweather";
