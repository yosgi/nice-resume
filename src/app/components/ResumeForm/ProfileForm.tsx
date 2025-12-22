import { BaseForm } from "components/ResumeForm/Form";
import { Input, Textarea } from "components/ResumeForm/Form/InputGroup";
import { DeleteIconButton } from "components/ResumeForm/Form/IconButton";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeProfile,
  selectProfile,
  addProfileAdditionalField,
  deleteProfileAdditionalField,
  changeProfileAdditionalField,
} from "lib/redux/resumeSlice";
import { ResumeProfile } from "lib/redux/types";
import { useTranslation } from "../../../../utils/translations";
import { PlusSmallIcon } from "@heroicons/react/24/outline";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { name, email, phone, url, summary, location, title, additionalFields } = profile;

  const handleProfileChange = (field: keyof ResumeProfile, value: string) => {
    dispatch(changeProfile({ field, value }));
  };

  const handleAddAdditionalField = () => {
    dispatch(addProfileAdditionalField());
  };

  const handleDeleteAdditionalField = (idx: number) => {
    dispatch(deleteProfileAdditionalField({ idx }));
  };

  const handleChangeAdditionalField = (
    idx: number,
    value: string
  ) => {
    dispatch(changeProfileAdditionalField({ idx, value }));
  };

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <Input
          label={t("profile.name")}
          labelClassName="col-span-full"
          name="name"
          placeholder={t("profile.namePlaceholder")}
          value={name}
          onChange={handleProfileChange}
        />
        <Input
          label={t("profile.jobTitle")}
          labelClassName="col-span-full"
          name="title"
          placeholder={t("profile.jobTitlePlaceholder")}
          value={title}
          onChange={handleProfileChange}
        />
        <Textarea
          label={t("profile.objective")}
          labelClassName="col-span-full"
          name="summary"
          placeholder={t("profile.objectivePlaceholder")}
          value={summary}
          onChange={handleProfileChange}
        />
        <Input
          label={t("profile.email")}
          labelClassName="col-span-4"
          name="email"
          placeholder={t("profile.emailPlaceholder")}
          value={email}
          onChange={handleProfileChange}
        />
        <Input
          label={t("profile.phone")}
          labelClassName="col-span-2"
          name="phone"
          placeholder={t("profile.phonePlaceholder")}
          value={phone}
          onChange={handleProfileChange}
        />
        <Input
          label={t("profile.website")}
          labelClassName="col-span-4"
          name="url"
          placeholder={t("profile.websitePlaceholder")}
          value={url}
          onChange={handleProfileChange}
        />
        <Input
          label={t("profile.location")}
          labelClassName="col-span-2"
          name="location"
          placeholder={t("profile.locationPlaceholder")}
          value={location}
          onChange={handleProfileChange}
        />
        {additionalFields.map((value, idx) => {
          // Handle old data format (object) or ensure value is string
          const stringValue = typeof value === "string" 
            ? value 
            : (typeof value === "object" && value !== null && "value" in value 
                ? String((value as { value: unknown }).value) 
                : "");
          
          return (
            <div key={idx} className="col-span-full relative">
              <Input
                label={t("profile.additionalField")}
                labelClassName="col-span-5"
                name={`additionalField-${idx}`}
                placeholder={t("profile.additionalFieldPlaceholder")}
                value={stringValue}
                onChange={(name, newValue) => handleChangeAdditionalField(idx, newValue)}
              />
              <div className="absolute right-0 top-0">
                <DeleteIconButton
                  onClick={() => handleDeleteAdditionalField(idx)}
                  tooltipText={t("profile.deleteAdditionalField")}
                />
              </div>
            </div>
          );
        })}
        <div className="col-span-full mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleAddAdditionalField}
            className="flex items-center rounded-md bg-white py-2 pl-3 pr-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <PlusSmallIcon
              className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            {t("profile.addAdditionalField")}
          </button>
        </div>
      </div>
    </BaseForm>
  );
};
