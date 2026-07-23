import type { ResumeProfile } from "lib/redux/types";

export const CORE_CONTACT_KEYS = ["email", "phone", "url", "location"] as const;

export type CoreContactKey = (typeof CORE_CONTACT_KEYS)[number];
export type ContactOrderKey = CoreContactKey | `additional-${number}`;

const isCoreContactKey = (key: string): key is CoreContactKey =>
  CORE_CONTACT_KEYS.includes(key as CoreContactKey);

export const getContactOrder = (profile: ResumeProfile): ContactOrderKey[] => {
  const additionalKeys = profile.additionalFields.map(
    (_, index) => `additional-${index}` as const
  );
  const validKeys = new Set<ContactOrderKey>([
    ...CORE_CONTACT_KEYS,
    ...additionalKeys,
  ]);
  const orderedKeys: ContactOrderKey[] = [];

  for (const key of profile.contactOrder || []) {
    if (
      (isCoreContactKey(key) || /^additional-\d+$/.test(key)) &&
      validKeys.has(key as ContactOrderKey) &&
      !orderedKeys.includes(key as ContactOrderKey)
    ) {
      orderedKeys.push(key as ContactOrderKey);
    }
  }

  for (const key of [...CORE_CONTACT_KEYS, ...additionalKeys]) {
    if (!orderedKeys.includes(key)) orderedKeys.push(key);
  }

  return orderedKeys;
};

export const getContactOrderAfterAdditionalFieldDeletion = (
  order: ContactOrderKey[],
  deletedIndex: number
): ContactOrderKey[] =>
  order.flatMap((key) => {
    const match = key.match(/^additional-(\d+)$/);
    if (!match) return [key];

    const index = Number(match[1]);
    if (index === deletedIndex) return [];
    return [
      `additional-${
        index > deletedIndex ? index - 1 : index
      }` as ContactOrderKey,
    ];
  });
