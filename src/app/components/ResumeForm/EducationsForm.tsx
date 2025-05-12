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
import { useTranslation } from "../../../../utils/translations";

export const EducationsForm = () => {
  const educations = useAppSelector(selectEducations);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const showDelete = educations.length > 1;
  const form = "educations";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <Form form={form} addButtonText={t("education.addButtonText")}>
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
              deleteButtonTooltipText={t("education.deleteButtonTooltipText")}
            >
              <Input
                label={t("education.school")}
                labelClassName="col-span-4"
                name="school"
                placeholder={t("education.schoolPlaceholder")}
                value={school}
                onChange={handleEducationChange}
              />
              <Input
                label={t("education.date")}
                labelClassName="col-span-2"
                name="date"
                placeholder={t("education.datePlaceholder")}
                value={date}
                onChange={handleEducationChange}
              />
              <Input
                label={t("education.degree")}
                labelClassName="col-span-4"
                name="degree"
                placeholder={t("education.degreePlaceholder")}
                value={degree}
                onChange={handleEducationChange}
              />
              <Input
                label={t("education.gpa")}
                labelClassName="col-span-2"
                name="gpa"
                placeholder={t("education.gpaPlaceholder")}
                value={gpa}
                onChange={handleEducationChange}
              />
              <div className="relative col-span-full">
                <BulletListTextarea
                  label={t("education.additionalInfo")}
                  labelClassName="col-span-full"
                  name="descriptions"
                  placeholder={t("education.additionalInfoPlaceholder")}
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
