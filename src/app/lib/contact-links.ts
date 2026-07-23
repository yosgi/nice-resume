import type { ResumeContactField } from "lib/redux/types";

export const normalizeContactField = (
  field: ResumeContactField
): { value: string; label: string } => {
  if (typeof field === "string") {
    return { value: field, label: "" };
  }

  return {
    value: typeof field.value === "string" ? field.value : "",
    label: typeof field.label === "string" ? field.label : "",
  };
};

const getHostname = (value: string): string => {
  const normalizedUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(value)
    ? value
    : `https://${value}`;

  try {
    return new URL(normalizedUrl).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
};

const getReadableHostname = (value: string): string => {
  const withoutScheme = value.replace(/^[a-z][a-z\d+.-]*:\/\//i, "");
  const hostname = withoutScheme.split(/[/?#]/)[0].replace(/^www\./i, "");
  return hostname && !/\s/.test(hostname) ? hostname : getHostname(value);
};

export const getFriendlyLinkText = (
  value: string,
  customLabel = ""
): string => {
  const trimmedLabel = customLabel.trim();
  if (trimmedLabel) return trimmedLabel;

  const hostname = getHostname(value);
  if (/(\.|^)linkedin\.com$/i.test(hostname)) return "LinkedIn";
  if (/(\.|^)github\.com$/i.test(hostname)) return "GitHub";

  return getReadableHostname(value) || value;
};

export const isLikelyUrl = (value: string): boolean => {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return false;
  const hostname = getHostname(value);
  return Boolean(hostname && hostname.includes("."));
};

export const getLinkHref = (value: string): string =>
  /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`;
