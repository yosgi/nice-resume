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
  setProfileContactOrder,
} from "lib/redux/resumeSlice";
import { ResumeProfile } from "lib/redux/types";
import { useTranslation } from "../../../../utils/translations";
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import { normalizeContactField } from "lib/contact-links";
import { getContactOrder, type ContactOrderKey } from "lib/contact-order";
import { SortableList } from "components/ResumeForm/common/SortableList";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const {
    name,
    email,
    phone,
    url,
    urlLabel,
    summary,
    location,
    title,
    additionalFields,
  } = profile;
  const contactOrder = getContactOrder(profile);

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
    field: "value" | "label",
    value: string
  ) => {
    dispatch(changeProfileAdditionalField({ idx, field, value }));
  };

  const handleContactReorder = (fromIndex: number, toIndex: number) => {
    const nextOrder = [...contactOrder];
    const [movedField] = nextOrder.splice(fromIndex, 1);
    nextOrder.splice(toIndex, 0, movedField);
    dispatch(setProfileContactOrder({ order: nextOrder }));
  };

  const renderContactField = (
    key: ContactOrderKey,
    dragHandle: React.ReactNode
  ) => {
    let fields: React.ReactNode;

    if (key === "email") {
      fields = (
        <Input
          label={t("profile.email")}
          labelClassName="col-span-full"
          name="email"
          placeholder={t("profile.emailPlaceholder")}
          value={email}
          onChange={handleProfileChange}
        />
      );
    } else if (key === "phone") {
      fields = (
        <Input
          label={t("profile.phone")}
          labelClassName="col-span-full"
          name="phone"
          placeholder={t("profile.phonePlaceholder")}
          value={phone}
          onChange={handleProfileChange}
        />
      );
    } else if (key === "url") {
      fields = (
        <>
          <Input
            label={t("profile.website")}
            labelClassName="col-span-4"
            name="url"
            placeholder={t("profile.websitePlaceholder")}
            value={url}
            onChange={handleProfileChange}
          />
          <Input
            label={t("profile.websiteLabel")}
            labelClassName="col-span-2"
            name="urlLabel"
            placeholder={t("profile.websiteLabelPlaceholder")}
            value={urlLabel}
            onChange={handleProfileChange}
          />
          <p className="col-span-full -mt-1 text-xs text-gray-500">
            {t("profile.websiteLabelHelp")}
          </p>
        </>
      );
    } else if (key === "location") {
      fields = (
        <Input
          label={t("profile.location")}
          labelClassName="col-span-full"
          name="location"
          placeholder={t("profile.locationPlaceholder")}
          value={location}
          onChange={handleProfileChange}
        />
      );
    } else {
      const additionalIndex = Number(key.replace("additional-", ""));
      const { value, label } = normalizeContactField(
        additionalFields[additionalIndex]
      );
      fields = (
        <>
          <Input
            label={t("profile.additionalField")}
            labelClassName="col-span-4"
            name={`additionalField-${additionalIndex}`}
            placeholder={t("profile.additionalFieldPlaceholder")}
            value={value}
            onChange={(name, newValue) =>
              handleChangeAdditionalField(additionalIndex, "value", newValue)
            }
          />
          <Input
            label={t("profile.additionalFieldLabel")}
            labelClassName="col-span-2"
            name={`additionalFieldLabel-${additionalIndex}`}
            placeholder={t("profile.additionalFieldLabelPlaceholder")}
            value={label}
            onChange={(name, newValue) =>
              handleChangeAdditionalField(additionalIndex, "label", newValue)
            }
          />
          <div className="absolute right-0 top-0">
            <DeleteIconButton
              onClick={() => handleDeleteAdditionalField(additionalIndex)}
              tooltipText={t("profile.deleteAdditionalField")}
            />
          </div>
        </>
      );
    }

    return (
      <div className="flex items-start gap-2">
        <div className="mt-6 flex shrink-0 items-center">{dragHandle}</div>
        <div className="relative grid min-w-0 flex-1 grid-cols-6 gap-3">
          {fields}
        </div>
      </div>
    );
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
        <SortableList
          items={contactOrder}
          getKey={(key) => key}
          onReorder={handleContactReorder}
          renderItem={(key, _, dragHandle) =>
            renderContactField(key, dragHandle)
          }
          className="col-span-full grid gap-3"
          itemClassName="rounded-lg border border-gray-200 bg-gray-50 p-3 transition-[box-shadow,opacity,transform] duration-200"
          dragLabel={t("sorting.drag")}
        />
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
