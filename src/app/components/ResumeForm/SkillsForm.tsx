import { Form, FormSection } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  Input,
  InputGroupWrapper,
} from "components/ResumeForm/Form/InputGroup";
import { FeaturedSkillInput } from "components/ResumeForm/Form/FeaturedSkillInput";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectSkills, changeSkills } from "lib/redux/resumeSlice";
import type { ResumeSkills } from "lib/redux/types";
import {
  selectShowBulletPoints,
  changeShowBulletPoints,
  selectThemeColor,
  selectSettings,
} from "lib/redux/settingsSlice";
import { SpacingControl } from "./common/SpacingControl";
import { useTranslation } from "../../../../utils/translations";

export const SkillsForm = () => {
  const skills = useAppSelector(selectSkills);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { featuredSkills, descriptions } = skills;
  const form = "skills";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));
  const themeColor = useAppSelector(selectThemeColor) || "#38bdf8";
  const handleSkillsChange = (field: "descriptions", value: string[]) => {
    dispatch(changeSkills({ field, value }));
  };
  const handleFeaturedSkillsChange = (
    idx: number,
    skill: string,
    rating: number
  ) => {
    dispatch(changeSkills({ field: "featuredSkills", idx, skill, rating }));
  };
  const handleShowBulletPoints = (value: boolean) => {
    dispatch(changeShowBulletPoints({ field: form, value }));
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <Form form={form} addButtonText={t("skills.addButtonText")}>
        <div className="col-span-full grid grid-cols-6 gap-3">
          <div className="relative col-span-full">
            <BulletListTextarea
              label={t("skills.skillsList")}
              labelClassName="col-span-full"
              name="descriptions"
              placeholder={t("skills.skillsListPlaceholder")}
              value={descriptions}
              onChange={handleSkillsChange}
              showBulletPoints={showBulletPoints}
            />
            <div className="absolute left-[4.5rem] top-[0.07rem]">
              <BulletListIconButton
                showBulletPoints={showBulletPoints}
                onClick={handleShowBulletPoints}
              />
            </div>
          </div>
          <div className="col-span-full mb-4 mt-6 border-t-2 border-dotted border-gray-200" />
          <InputGroupWrapper
            label={t("skills.featuredSkills")}
            className="col-span-full"
          >
            <p className="mt-2 text-sm font-normal text-gray-600">
              {t("skills.featuredSkillsDescription")}
            </p>
          </InputGroupWrapper>

          {featuredSkills.map(({ skill, rating }, idx) => (
            <FeaturedSkillInput
              key={idx}
              className="col-span-3"
              skill={skill}
              rating={rating}
              setSkillRating={(newSkill, newRating) => {
                handleFeaturedSkillsChange(idx, newSkill, newRating);
              }}
              placeholder={`${t("skills.featuredSkillPlaceholder")} ${idx + 1}`}
              circleColor={themeColor}
            />
          ))}
        </div>
      </Form>
    </section>
  );
};
