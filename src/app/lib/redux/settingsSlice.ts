import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";
import { createAction } from "@reduxjs/toolkit";

// Default translations for headings
const defaultHeadings = {
  en: {
    workExperience: "Work Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    custom: "Custom Section",
  },
  zh: {
    workExperience: "工作经验",
    education: "教育经历",
    projects: "项目经验",
    skills: "技能",
    custom: "自定义",
  },
};

// Get the default language from localStorage or use 'en' as fallback
const getDefaultLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) return savedLanguage;
  
  const browserLang = navigator.language.split('-')[0];
  console.log(browserLang,"browserLang");
  return browserLang === 'zh' ? 'zh' : 'en';
};

const getTranslatedHeading = (key: string) => {
  const language = getDefaultLanguage() as keyof typeof defaultHeadings;
  return defaultHeadings[language][key as keyof typeof defaultHeadings[typeof language]] || key;
};

export interface Settings {
  themeColor: string;
  fontFamily: string;
  fontSize: string;
  documentSize: string;
  formToShow: {
    workExperiences: boolean;
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
  };
  formToHeading: {
    workExperiences: string;
    educations: string;
    projects: string;
    skills: string;
    custom: string;
  };
  formsOrder: ShowForm[];
  showBulletPoints: {
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
  };
  sectionSpacing: {
    workExperiences: number;
    educations: number;
    projects: number;
    skills: number;
    custom: number;
  };
}

export type ShowForm = keyof Settings["formToShow"];
export type FormWithBulletPoints = keyof Settings["showBulletPoints"];
export type GeneralSetting =
  | "themeColor"
  | "fontFamily"
  | "fontSize"
  | "documentSize"
  | "sectionSpacing";

export const DEFAULT_THEME_COLOR = "#1D2E4D"; // sky-400
export const DEFAULT_FONT_FAMILY = "Merriweather";
export const DEFAULT_FONT_SIZE = "10"; // text-base https://tailwindcss.com/docs/font-size
export const DEFAULT_FONT_COLOR = "#171717"; // text-neutral-800

export const initialSettings: Settings = {
  themeColor: DEFAULT_THEME_COLOR,
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: DEFAULT_FONT_SIZE,
  documentSize: "A4",
  formToShow: {
    workExperiences: true,
    educations: true,
    projects: true,
    skills: true,
    custom: false,
  },
  formToHeading: {
    workExperiences: getTranslatedHeading("workExperience"),
    educations: getTranslatedHeading("education"),
    projects: getTranslatedHeading("projects"),
    skills: getTranslatedHeading("skills"),
    custom: getTranslatedHeading("custom"),
  },
  formsOrder: ["workExperiences", "educations", "projects", "skills", "custom"],
  showBulletPoints: {
    educations: true,
    projects: true,
    skills: true,
    custom: true,
  },
  sectionSpacing: {
    workExperiences: 30,
    educations: 30,
    projects: 30,
    skills: 30,
    custom: 30,
  },
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettings,
  reducers: {
    changeSettings: (
      draft,
      action: PayloadAction<{
        field: GeneralSetting;
        value: string | Settings["sectionSpacing"];
      }>
    ) => {
      const { field, value } = action.payload;
      if (typeof value === "string") {
        (draft[field] as string) = value;
      } else if (field === "sectionSpacing") {
        Object.keys(draft.sectionSpacing).forEach((key) => {
          if (value[key as keyof typeof value] !== undefined) {
            draft.sectionSpacing[key as keyof typeof draft.sectionSpacing] = value[key as keyof typeof value];
          }
        });
      }
    },
    changeSectionSpacing: (
      draft,
      action: PayloadAction<{
        section: ShowForm;
        value: number;
      }>
    ) => {
      const { section, value } = action.payload;
      draft.sectionSpacing[section] = value;
    },
    changeShowForm: (
      draft,
      action: PayloadAction<{ field: ShowForm; value: boolean }>
    ) => {
      const { field, value } = action.payload;
      draft.formToShow[field] = value;
    },
    changeFormHeading: (
      draft,
      action: PayloadAction<{ field: ShowForm; value: string }>
    ) => {
      const { field, value } = action.payload;
      draft.formToHeading[field] = value;
    },
    changeFormOrder: (
      draft,
      action: PayloadAction<{ form: ShowForm; type: "up" | "down" }>
    ) => {
      const { form, type } = action.payload;
      const lastIdx = draft.formsOrder.length - 1;
      const pos = draft.formsOrder.indexOf(form);
      const newPos = type === "up" ? pos - 1 : pos + 1;
      const swapFormOrder = (idx1: number, idx2: number) => {
        const temp = draft.formsOrder[idx1];
        draft.formsOrder[idx1] = draft.formsOrder[idx2];
        draft.formsOrder[idx2] = temp;
      };
      if (newPos >= 0 && newPos <= lastIdx) {
        swapFormOrder(pos, newPos);
      }
    },
    changeShowBulletPoints: (
      draft,
      action: PayloadAction<{
        field: FormWithBulletPoints;
        value: boolean;
      }>
    ) => {
      const { field, value } = action.payload;
      draft["showBulletPoints"][field] = value;
    },
    setSettings: (draft, action: PayloadAction<Settings>) => {
      return action.payload;
    },
  },
});

export const {
  changeSettings,
  changeShowForm,
  changeFormHeading,
  changeFormOrder,
  changeShowBulletPoints,
  setSettings,
  changeSectionSpacing,
} = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;
export const selectThemeColor = (state: RootState) => state.settings.themeColor;

export const selectFormToShow = (state: RootState) => state.settings.formToShow;
export const selectShowByForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formToShow[form];

export const selectFormToHeading = (state: RootState) =>
  state.settings.formToHeading;
export const selectHeadingByForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formToHeading[form];

export const selectFormsOrder = (state: RootState) => state.settings.formsOrder;
export const selectIsFirstForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formsOrder[0] === form;
export const selectIsLastForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formsOrder[state.settings.formsOrder.length - 1] === form;

export const selectShowBulletPoints =
  (form: FormWithBulletPoints) => (state: RootState) =>
    state.settings.showBulletPoints[form];

export default settingsSlice.reducer;
