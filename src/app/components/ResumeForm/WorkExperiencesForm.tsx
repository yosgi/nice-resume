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
import { selectSettings } from "lib/redux/settingsSlice";
import { SpacingControl } from "./common/SpacingControl";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const showDelete = workExperiences.length > 1;
  const form = "workExperiences";

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex justify-end mb-4">
        <SpacingControl 
          section={form}
          value={settings.sectionSpacing[form]} 
        />
      </div>
      <Form form={form} addButtonText="Add Work Experience">
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
              deleteButtonTooltipText="Delete work experience"
            >
              <Input
                label="Company"
                labelClassName="col-span-4"
                name="company"
                placeholder="Google"
                value={company}
                onChange={handleWorkExperienceChange}
              />
              <Input
                label="Date"
                labelClassName="col-span-2"
                name="date"
                placeholder="June 2021 - Present"
                value={date}
                onChange={handleWorkExperienceChange}
              />
              <Input
                label="Job Title"
                labelClassName="col-span-6"
                name="jobTitle"
                placeholder="Software Engineer"
                value={jobTitle}
                onChange={handleWorkExperienceChange}
              />
              <BulletListTextarea
                label="Description"
                labelClassName="col-span-full"
                name="descriptions"
                placeholder="Bullet points"
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
