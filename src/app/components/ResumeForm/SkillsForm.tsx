import { useRef } from "react";
import { Form } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  InputGroupWrapper,
} from "components/ResumeForm/Form/InputGroup";
import { FeaturedSkillInput } from "components/ResumeForm/Form/FeaturedSkillInput";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  selectSkills,
  changeSkills,
  reorderSectionInForm,
} from "lib/redux/resumeSlice";
import {
  selectShowBulletPoints,
  changeShowBulletPoints,
  selectThemeColor,
} from "lib/redux/settingsSlice";
import { useTranslation } from "../../../../utils/translations";
import { SortableList } from "./common/SortableList";
import type { FeaturedSkill } from "lib/redux/types";

export const SkillsForm = () => {
  const skills = useAppSelector(selectSkills);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { featuredSkills, descriptions } = skills;
  const form = "skills";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));
  const themeColor = useAppSelector(selectThemeColor) || "#38bdf8";
  const featuredSkillIds = useRef(new WeakMap<FeaturedSkill, string>());
  const nextFeaturedSkillId = useRef(0);
  const getFeaturedSkillId = (featuredSkill: FeaturedSkill) => {
    const existingId = featuredSkillIds.current.get(featuredSkill);
    if (existingId) return existingId;
    const id = `featured-skill-${nextFeaturedSkillId.current++}`;
    featuredSkillIds.current.set(featuredSkill, id);
    return id;
  };
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
        </div>
        <div className="-mx-6 mb-4 mt-6 border-t-2 border-dotted border-gray-200" />
        <div className="grid grid-cols-6 gap-3">
          <InputGroupWrapper
            label={t("skills.featuredSkills")}
            className="col-span-full"
          >
            <p className="mt-2 text-sm font-normal text-gray-600">
              {t("skills.featuredSkillsDescription")}
            </p>
          </InputGroupWrapper>

          <SortableList
            items={featuredSkills}
            getKey={getFeaturedSkillId}
            onReorder={(fromIdx, toIdx) =>
              dispatch(reorderSectionInForm({ form, fromIdx, toIdx }))
            }
            className="col-span-full grid grid-cols-6 gap-3"
            itemClassName="col-span-3 mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-[box-shadow,opacity,transform] duration-200"
            dragLabel={t("sorting.drag")}
            strategy="rect"
            renderItem={({ skill, rating }, idx, dragHandle) => (
              <div className="flex items-stretch gap-2">
                <div className="flex shrink-0 items-center border-r border-gray-200 pr-2">
                  {dragHandle}
                </div>
                <div className="min-w-0 flex-1">
                  <FeaturedSkillInput
                    skill={skill}
                    rating={rating}
                    setSkillRating={(newSkill, newRating) => {
                      handleFeaturedSkillsChange(idx, newSkill, newRating);
                    }}
                    placeholder={`${t("skills.featuredSkillPlaceholder")} ${
                      idx + 1
                    }`}
                    circleColor={themeColor}
                  />
                </div>
              </div>
            )}
          />
        </div>
      </Form>
    </section>
  );
};
