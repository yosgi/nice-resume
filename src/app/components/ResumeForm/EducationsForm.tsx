import { Form, FormSection } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  Input,
} from "components/ResumeForm/Form/InputGroup";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeEducations, selectEducations } from "lib/redux/resumeSlice";
import type { ResumeEducation } from "lib/redux/types";
import {
  changeShowBulletPoints,
  selectShowBulletPoints,
  selectSettings,
} from "lib/redux/settingsSlice";
import { SpacingControl } from "./common/SpacingControl";

export const EducationsForm = () => {
  const educations = useAppSelector(selectEducations);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const showDelete = educations.length > 1;
  const form = "educations";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex justify-end mb-4">
        <SpacingControl 
          section="educations" 
          value={settings.sectionSpacing.educations} 
        />
      </div>
      <Form form={form} addButtonText="Add School">
        {educations.map(({ school, degree, gpa, date, descriptions }, idx) => {
          const handleEducationChange = (
            ...[
              field,
              value,
            ]: CreateHandleChangeArgsWithDescriptions<ResumeEducation>
          ) => {
            dispatch(changeEducations({ idx, field, value } as any));
          };

          const handleShowBulletPoints = (value: boolean) => {
            dispatch(changeShowBulletPoints({ field: form, value }));
          };

          const showMoveUp = idx !== 0;
          const showMoveDown = idx !== educations.length - 1;

          return (
            <FormSection
              key={idx}
              form="educations"
              idx={idx}
              showMoveUp={showMoveUp}
              showMoveDown={showMoveDown}
              showDelete={showDelete}
              deleteButtonTooltipText="Delete school"
            >
              <Input
                label="School"
                labelClassName="col-span-4"
                name="school"
                placeholder="Harvard University"
                value={school}
                onChange={handleEducationChange}
              />
              <Input
                label="Date"
                labelClassName="col-span-2"
                name="date"
                placeholder="June 2021"
                value={date}
                onChange={handleEducationChange}
              />
              <Input
                label="Degree & Major"
                labelClassName="col-span-4"
                name="degree"
                placeholder="Master of Business Administration (MBA)"
                value={degree}
                onChange={handleEducationChange}
              />
              <Input
                label="GPA"
                labelClassName="col-span-2"
                name="gpa"
                placeholder="4.0"
                value={gpa}
                onChange={handleEducationChange}
              />
              <div className="relative col-span-full">
                <BulletListTextarea
                  label="Additional Information (Optional)"
                  labelClassName="col-span-full"
                  name="descriptions"
                  placeholder="Dean's List, Leadership roles, scholarships, relevant coursework, or other achievements"
                  value={descriptions}
                  onChange={handleEducationChange}
                  showBulletPoints={showBulletPoints}
                />
                <div className="absolute left-[15.6rem] top-[0.07rem]">
                  <BulletListIconButton
                    showBulletPoints={showBulletPoints}
                    onClick={handleShowBulletPoints}
                  />
                </div>
              </div>
            </FormSection>
          );
        })}
      </Form>
    </section>
  );
};
