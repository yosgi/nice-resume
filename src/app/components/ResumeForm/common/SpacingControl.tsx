import { useAppDispatch } from "lib/redux/hooks";
import { changeSectionSpacing } from "lib/redux/settingsSlice";
import { cx } from "lib/cx";

export const SpacingControl = ({
  section,
  value,
}: {
  section: "workExperiences" | "educations" | "projects" | "skills" | "custom";
  value: number;
}) => {
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    dispatch(
      changeSectionSpacing({
        section,
        value: newValue,
      })
    );
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">Spacing:</label>
      <input
        type="range"
        min="10"
        max="60"
        step="5"
        value={value}
        onChange={handleChange}
        className={cx(
          "h-2 w-24 appearance-none rounded-lg bg-gray-200",
          "hover:bg-gray-300",
          "focus:outline-none focus:ring-2 focus:ring-blue-500"
        )}
        title={`${value}pt spacing`}
      />
      <span className="text-sm text-gray-600">{value}pt</span>
    </div>
  );
}; 