import { Text, View, Link } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import { addTextBreakOpportunities } from "lib/pdf-text-wrapping";

export { addTextBreakOpportunities } from "lib/pdf-text-wrapping";

export const ResumePDFSection = ({
  themeColor,
  heading,
  style = {},
  children,
  customSpacing,
}: {
  themeColor?: string;
  heading?: string;
  style?: Style;
  children: React.ReactNode;
  customSpacing?: number; // 自定义间距，单位为 pt
}) => (
  <View
    style={{
      ...styles.flexCol,
      gap: spacing["2"],
      marginTop:
        customSpacing !== undefined ? `${customSpacing}pt` : spacing["10"],
      ...style,
    }}
  >
    {heading && (
      <View
        minPresenceAhead={40}
        style={{ ...styles.flexRow, alignItems: "center" }}
      >
        <Text
          style={{
            fontWeight: "bold",
            letterSpacing: "0.3pt",
            fontSize: "12pt",
          }}
          debug={DEBUG_RESUME_PDF_FLAG}
        >
          {heading}
        </Text>
      </View>
    )}
    {children}
  </View>
);

export const ResumePDFText = ({
  bold = false,
  themeColor,
  style = {},
  children,
  maxSegmentLength = 30,
}: {
  bold?: boolean;
  themeColor?: string;
  style?: Style;
  children: React.ReactNode;
  maxSegmentLength?: number;
}) => {
  const breakableChildren =
    typeof children === "string"
      ? addTextBreakOpportunities(children, maxSegmentLength)
      : children;

  return (
    <Text
      style={{
        fontWeight: bold ? "bold" : "normal",
        maxWidth: "100%",
        ...style,
      }}
      debug={DEBUG_RESUME_PDF_FLAG}
    >
      {breakableChildren}
    </Text>
  );
};

export const ResumePDFTitleDateRow = ({
  title,
  date,
  titleBold = false,
  dateStyle = {},
  style = {},
}: {
  title: string;
  date: string;
  titleBold?: boolean;
  dateStyle?: Style;
  style?: Style;
}) => (
  <View
    style={{
      ...styles.flexRow,
      alignItems: "flex-start",
      width: "100%",
      ...style,
    }}
  >
    <View
      style={{
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        minWidth: 0,
        paddingRight: date ? spacing["2"] : 0,
      }}
    >
      <ResumePDFText bold={titleBold} maxSegmentLength={30}>
        {title}
      </ResumePDFText>
    </View>
    {date && (
      <View
        style={{
          flexGrow: 0,
          flexShrink: 1,
          maxWidth: "35%",
        }}
      >
        <ResumePDFText
          maxSegmentLength={18}
          style={{
            textAlign: "right",
            ...dateStyle,
          }}
        >
          {date}
        </ResumePDFText>
      </View>
    )}
  </View>
);
export const ResumePDFProgressBar = ({
  progress,
  themeColor,
}: {
  progress: number;
  themeColor: string;
}) => {
  return (
    <View
      style={{
        height: "3pt",
        width: "100%",
        maxWidth: "100%",
        backgroundColor: "#2f3d5a",
        borderRadius: "0.5pt",
        overflow: "hidden",
        marginTop: "2pt",
        position: "relative",
      }}
    >
      <View
        style={{
          height: "100%",
          width: `${progress}%`,
          position: "absolute",
          backgroundColor: "white",
        }}
      />
    </View>
  );
};

export const ResumePDFBulletList = ({
  items,
  showBulletPoints = true,
  maxSegmentLength = 30,
}: {
  items: string[];
  showBulletPoints?: boolean;
  maxSegmentLength?: number;
}) => {
  return (
    <View style={{ ...styles.flexCol }}>
      {items.map((item, idx) => (
        <View
          style={{
            ...styles.flexRow,
            marginBottom: idx === items.length - 1 ? 0 : spacing["1"],
          }}
          key={idx}
        >
          {/* A breaking change was introduced causing text layout to be wider than node's width
              https://github.com/diegomura/react-pdf/issues/2182. flexGrow & flexBasis fixes it */}
          <ResumePDFText
            maxSegmentLength={maxSegmentLength}
            style={{
              flexGrow: 1,
              flexBasis: 0,
              padding: "1pt 0",
            }}
          >
            {item}
          </ResumePDFText>
        </View>
      ))}
    </View>
  );
};

export const ResumePDFLink = ({
  src,
  isPDF,
  children,
}: {
  src: string;
  isPDF: boolean;
  children: React.ReactNode;
}) => {
  if (isPDF) {
    return (
      <Link src={src} style={{ textDecoration: "none", width: "100%" }}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={src}
      style={{ textDecoration: "none", display: "block", width: "100%" }}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export const ResumeFeaturedSkill = ({
  skill,
  rating,
  themeColor,
  style = {},
}: {
  skill: string;
  rating: number;
  themeColor: string;
  style?: Style;
}) => {
  const numCircles = 5;

  return (
    <View style={{ ...styles.flexCol, ...style }}>
      <ResumePDFText maxSegmentLength={14}>{skill}</ResumePDFText>
      {/* {[...Array(numCircles)].map((_, idx) => (
        <View
          key={idx}
          style={{
            height: "9pt",
            width: "9pt",
            marginLeft: "2.25pt",
            backgroundColor: rating >= idx ? themeColor : "#d9d9d9",
            borderRadius: "100%",
          }}
        />
      ))} */}
    </View>
  );
};
