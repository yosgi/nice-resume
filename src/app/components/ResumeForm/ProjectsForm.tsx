import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectProjects, changeProjects } from "lib/redux/resumeSlice";
import type { ResumeProject } from "lib/redux/types";
import {
  changeShowBulletPoints,
  selectShowBulletPoints,
  selectSettings,
} from "lib/redux/settingsSlice";
import { SpacingControl } from "./common/SpacingControl";

export const ProjectsForm = () => {
  const projects = useAppSelector(selectProjects);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const showDelete = projects.length > 1;
  const form = "projects";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex justify-end mb-4">
        <SpacingControl 
          section="projects" 
          value={settings.sectionSpacing.projects} 
        />
      </div>
      <Form form={form} addButtonText="Add Project">
        {projects.map(({ project, date, descriptions }, idx) => {
          const handleProjectChange = (
            ...[
              field,
              value,
            ]: CreateHandleChangeArgsWithDescriptions<ResumeProject>
          ) => {
            dispatch(changeProjects({ idx, field, value } as any));
          };
          const showMoveUp = idx !== 0;
          const showMoveDown = idx !== projects.length - 1;

          return (
            <FormSection
              key={idx}
              form={form}
              idx={idx}
              showMoveUp={showMoveUp}
              showMoveDown={showMoveDown}
              showDelete={showDelete}
              deleteButtonTooltipText={"Delete project"}
            >
              <Input
                name="project"
                label="Project Name"
                placeholder="Project Name"
                value={project}
                onChange={handleProjectChange}
                labelClassName="col-span-4"
              />
              <Input
                name="date"
                label="Date"
                placeholder="Winter 2022"
                value={date}
                onChange={handleProjectChange}
                labelClassName="col-span-2"
              />
              <BulletListTextarea
                name="descriptions"
                label="Description"
                placeholder="Bullet points"
                value={descriptions}
                onChange={handleProjectChange}
                labelClassName="col-span-full"
              />
            </FormSection>
          );
        })}
      </Form>
    </section>
  );
};
