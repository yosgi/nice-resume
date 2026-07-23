import { useTranslation } from "../../../../../utils/translations";

export const ItemSpacingControl = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="col-span-full flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
      <label className="whitespace-nowrap text-xs font-medium text-gray-600">
        {t("spacing.afterEntry")}: {value}pt
      </label>
      <input
        type="range"
        min="0"
        max="40"
        step="2"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="min-w-0 flex-1"
        title={t("spacing.afterEntryTooltip", { value })}
      />
    </div>
  );
};
