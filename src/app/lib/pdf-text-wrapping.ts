const DEFAULT_MAX_SEGMENT_LENGTH = 14;

/**
 * Adds deterministic line breaks to long, uninterrupted text such as URLs,
 * email addresses, IDs, and long names.
 *
 * react-pdf's hyphenation engine can add visible hyphens or lose character
 * offsets when fed zero-width spaces. Newlines are handled identically by the
 * browser preview and PDF renderer, and never change the visible characters.
 */
export const addTextBreakOpportunities = (
  text: string,
  maxSegmentLength = DEFAULT_MAX_SEGMENT_LENGTH
): string => {
  let currentSegmentLength = 0;

  return Array.from(text)
    .map((char) => {
      if (/\s/.test(char)) {
        currentSegmentLength = 0;
        return char;
      }

      currentSegmentLength += 1;

      const isNaturalBreak = /[.@/_?#=&+-]/.test(char);
      const isLongEnoughForNaturalBreak =
        currentSegmentLength >= Math.ceil(maxSegmentLength * 0.6);

      if (
        currentSegmentLength >= maxSegmentLength ||
        (isNaturalBreak && isLongEnoughForNaturalBreak)
      ) {
        currentSegmentLength = 0;
        return `${char}\n`;
      }

      return char;
    })
    .join("");
};
