import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeSectionSpacing, selectSettings } from "lib/redux/settingsSlice";
import { useTranslation } from "../../../../../utils/translations";
import type { ShowForm } from "lib/redux/settingsSlice";

export const SpacingControl = ({
  section,
  value,
}: {
  section: ShowForm;
  value: number;
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const settings = useAppSelector(selectSettings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    dispatch(changeSectionSpacing({ section, value: newValue }));
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 whitespace-nowrap">
        {t("spacing.label")}:
        {value}
      </label>
      <input
        type="range"
        min="0"
        max="60"
        step="5"
        value={value}
        onChange={handleChange}
        className="w-20"
        title={t("spacing.tooltip", { value: value.toFixed(1) })}
      />
    </div>
  );
}; 