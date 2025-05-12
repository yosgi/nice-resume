import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeWorkExperiences,
  selectWorkExperiences,
} from "lib/redux/resumeSlice";
import type { ResumeWorkExperience } from "lib/redux/types";
import { useTranslation } from "../../../../utils/translations";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const showDelete = workExperiences.length > 1;
  const form = "workExperiences";

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <Form form={form} addButtonText={t("workExperience.addButtonText")}>
        {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
          const handleWorkExperienceChange = (
            ...[
              field,
              value,
            ]: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
          ) => {
            dispatch(changeWorkExperiences({ idx, field, value } as any));
          };
          const showMoveUp = idx !== 0;
          const showMoveDown = idx !== workExperiences.length - 1;

          return (
            <FormSection
              key={idx}
              form={form}
              idx={idx}
              showMoveUp={showMoveUp}
              showMoveDown={showMoveDown}
              showDelete={showDelete}
              deleteButtonTooltipText={t("workExperience.deleteButtonTooltipText")}
            >
              <Input
                label={t("workExperience.company")}
                labelClassName="col-span-4"
                name="company"
                placeholder={t("workExperience.companyPlaceholder")}
                value={company}
                onChange={handleWorkExperienceChange}
              />
              <Input
                label={t("workExperience.date")}
                labelClassName="col-span-2"
                name="date"
                placeholder={t("workExperience.datePlaceholder")}
                value={date}
                onChange={handleWorkExperienceChange}
              />
              <Input
                label={t("workExperience.jobTitle")}
                labelClassName="col-span-6"
                name="jobTitle"
                placeholder={t("workExperience.jobTitlePlaceholder")}
                value={jobTitle}
                onChange={handleWorkExperienceChange}
              />
              <BulletListTextarea
                label={t("workExperience.description")}
                labelClassName="col-span-full"
                name="descriptions"
                placeholder={t("workExperience.descriptionPlaceholder")}
                value={descriptions}
                onChange={handleWorkExperienceChange}
              />
            </FormSection>
          );
        })}
      </Form>
    </section>
  );
};
