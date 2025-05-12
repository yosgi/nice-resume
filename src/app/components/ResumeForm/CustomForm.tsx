import { Form, FormSection } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  Input,
} from "components/ResumeForm/Form/InputGroup";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeCustom, selectCustom } from "lib/redux/resumeSlice";
import type { ResumeCustom } from "lib/redux/types";
import {
  changeShowBulletPoints,
  selectShowBulletPoints,
  selectSettings,
} from "lib/redux/settingsSlice";
import { SpacingControl } from "./common/SpacingControl";

export const CustomForm = () => {
  const custom = useAppSelector(selectCustom);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const form = "custom";
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <Form form={form}>
        <div className="relative col-span-full">
          <BulletListTextarea
            label="Content"
            labelClassName="col-span-full"
            name="descriptions"
            placeholder="Bullet points"
            value={custom.descriptions}
            onChange={(field, value) => {
              dispatch(changeCustom({ field, value }));
            }}
            showBulletPoints={showBulletPoints}
          />
          <div className="absolute left-[4.5rem] top-[0.07rem]">
            <BulletListIconButton
              showBulletPoints={showBulletPoints}
              onClick={(value) => {
                dispatch(changeShowBulletPoints({ field: form, value }));
              }}
            />
          </div>
        </div>
      </Form>
    </section>
  );
};
