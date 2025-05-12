import { BaseForm } from "components/ResumeForm/Form";
import { Input, Textarea } from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectProfile } from "lib/redux/resumeSlice";
import { ResumeProfile } from "lib/redux/types";
import { useTranslation } from "../../../../utils/translations";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { name, email, phone, url, summary, location, title } = profile;

  const handleProfileChange = (field: keyof ResumeProfile, value: string) => {
    dispatch(changeProfile({ field, value }));
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
      </div>
    </BaseForm>
  );
};
