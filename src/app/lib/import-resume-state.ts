import { deepMerge } from "lib/deep-merge";
import { initialResumeState } from "lib/redux/resumeSlice";
import {
  initialSettings,
  type Settings,
  type ShowForm,
} from "lib/redux/settingsSlice";
import type { Resume } from "lib/redux/types";

type ImportedResumeFile = {
  resume?: unknown;
  settings?: unknown;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const normalizeImportedResumeState = (
  importedFile: unknown
): { resume: Resume; settings: Settings } => {
  if (!isObject(importedFile) || !isObject(importedFile.resume)) {
    throw new Error("The JSON file does not contain a valid resume object.");
  }

  const settingsSource = isObject(importedFile.settings)
    ? importedFile.settings
    : {};

  return {
    resume: deepMerge(initialResumeState, importedFile.resume) as Resume,
    settings: deepMerge(initialSettings, settingsSource) as Settings,
  };
};

export const getImportedSectionVisibility = (
  resume: Resume
): Record<ShowForm, boolean> => ({
  workExperiences: resume.workExperiences.length > 0,
  educations: resume.educations.length > 0,
  projects: resume.projects.length > 0,
  skills:
    resume.skills.descriptions.some((description) => Boolean(description)) ||
    resume.skills.featuredSkills.some(({ skill }) => Boolean(skill)),
  custom: resume.custom.descriptions.some((description) =>
    Boolean(description)
  ),
});
