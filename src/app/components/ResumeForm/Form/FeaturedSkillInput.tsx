import React from "react";
import { INPUT_CLASS_NAME } from "components/ResumeForm/Form/InputGroup";
import { MoveIconButton } from "components/ResumeForm/Form/IconButton";

export const FeaturedSkillInput = ({
  skill,
  rating,
  setSkillRating,
  placeholder,
  circleColor,
  showMoveUp,
  showMoveDown,
  onMoveClick,
}: {
  skill: string;
  rating: number;
  setSkillRating: (skill: string, rating: number) => void;
  placeholder: string;
  circleColor?: string;
  showMoveUp: boolean;
  showMoveDown: boolean;
  onMoveClick: (direction: "up" | "down") => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-end gap-2">
        <div className="flex gap-0.5">
          <div
            className={`transition-all duration-300 ${
              showMoveUp ? "" : "invisible opacity-0"
            } ${showMoveDown ? "" : "-mr-6"}`}
          >
            <MoveIconButton
              type="up"
              size="small"
              onClick={() => onMoveClick("up")}
            />
          </div>
          <div
            className={`transition-all duration-300 ${
              showMoveDown ? "" : "invisible opacity-0"
            }`}
          >
            <MoveIconButton
              type="down"
              size="small"
              onClick={() => onMoveClick("down")}
            />
          </div>
        </div>
        <SliderRating
          rating={rating}
          setRating={(newRating) => setSkillRating(skill, newRating)}
          circleColor={circleColor}
        />
      </div>
      <input
        type="text"
        value={skill}
        placeholder={placeholder}
        onChange={(e) => setSkillRating(e.target.value, rating)}
        className={INPUT_CLASS_NAME}
      />
    </div>
  );
};

const SliderRating = ({
  rating,
  setRating,
  circleColor = "#38bdf8",
}: {
  rating: number;
  setRating: (rating: number) => void;
  circleColor?: string;
}) => {
  // Convert hex to rgba for opacity
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const lightColor = hexToRgba(circleColor, 0.3);

  return (
    <div className="flex items-center p-2 flex-shrink-0">
      <input
        type="range"
        min="0"
        max="4"
        step="1"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${lightColor} 0%, ${lightColor} ${(rating / 4) * 100}%, #d1d5db ${(rating / 4) * 100}%, #d1d5db 100%)`
        }}
      />
      <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">{rating + 1}/5</span>
    </div>
  );
};
