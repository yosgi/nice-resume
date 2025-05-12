import { Text, View, Link } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";

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
      marginTop: customSpacing ? `${customSpacing}pt` : spacing["10"],
      ...style,
    }}
  >
    {heading && (
      <View style={{ ...styles.flexRow, alignItems: "center" }}>
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
}: {
  bold?: boolean;
  themeColor?: string;
  style?: Style;
  children: React.ReactNode;
}) => {
  return (
    <Text
      style={{
        fontWeight: bold ? "bold" : "normal",
        ...style,
      }}
      debug={DEBUG_RESUME_PDF_FLAG}
    >
      {children}
    </Text>
  );
};
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
        width: "120pt",
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
}


export const ResumePDFBulletList = ({
  items,
  showBulletPoints = true,
}: {
  items: string[];
  showBulletPoints?: boolean;
}) => {
  return (
    <View style={{ ...styles.flexCol }}>
      {items.map((item, idx) => (
        <View 
          style={{ 
            ...styles.flexRow,
            marginBottom: idx === items.length - 1 ? 0 : spacing["1"]
          }} 
          key={idx}
        >
          {/* A breaking change was introduced causing text layout to be wider than node's width
              https://github.com/diegomura/react-pdf/issues/2182. flexGrow & flexBasis fixes it */}
          <ResumePDFText
            style={{ 
              flexGrow: 1, 
              flexBasis: 0,
              padding: "1pt 0"
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
      <Link src={src} style={{ textDecoration: "none" }}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={src}
      style={{ textDecoration: "none" }}
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
  style = {
   
  },
}: {
  skill: string;
  rating: number;
  themeColor: string;
  style?: Style;
}) => {
  const numCircles = 5;

  return (
    <View style={{ ...styles.flexCol, ...style, }}>
      <ResumePDFText>
        {skill}
      </ResumePDFText>
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
