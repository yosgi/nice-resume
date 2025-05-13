"use client";
import { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import {
  getHasUsedAppBefore,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import { type ShowForm, initialSettings } from "lib/redux/settingsSlice";
import { useRouter } from "next/navigation";
import addPdfSrc from "public/assets/add-pdf.svg";
import Image from "next/image";
import { cx } from "lib/cx";
import { deepClone } from "lib/deep-clone";
import { useTranslation } from "../../../utils/translations";

const defaultFileState = {
  name: "",
  size: 0,
  fileUrl: "",
};

export const ResumeDropzone = ({
  onFileUrlChange,
  className,
  playgroundView = false,
}: {
  onFileUrlChange: (fileUrl: string) => void;
  className?: string;
  playgroundView?: boolean;
}) => {
  const [file, setFile] = useState(defaultFileState);
  const [isHoveredOnDropzone, setIsHoveredOnDropzone] = useState(false);
  const [hasNonPdfFile, setHasNonPdfFile] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const hasFile = Boolean(file.name);

  const setNewFile = (newFile: File) => {
    // Revoke old object URL to avoid memory leaks
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }

    const { name, size } = newFile;
    const fileUrl = URL.createObjectURL(newFile);
    setFile({ name, size, fileUrl });
    onFileUrlChange(fileUrl);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    if (newFile?.name.endsWith(".pdf") || newFile?.name.endsWith(".json")) {
      setHasNonPdfFile(false);
      setNewFile(newFile);
    } else {
      setHasNonPdfFile(true);
    }
    setIsHoveredOnDropzone(false);
  };

  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setNewFile(files[0]);
  };

  const onRemove = () => {
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }
    setFile(defaultFileState);
    onFileUrlChange("");
  };

  const onImportClick = async () => {
    let resume = {
      workExperiences: [],
      educations: [],
      projects: [],
      skills: { descriptions: [] },
      custom: { descriptions: [] },
    } as any;

    let settings = deepClone(initialSettings);

    if (file.name.endsWith(".pdf")) {
      // Parse PDF file
      resume = await parseResumeFromPdf(file.fileUrl);
    } else {
      // Parse JSON file
      const response = await fetch(file.fileUrl);
      const json = await response.json();
      resume = json.resume;
      // Import settings from JSON if available
      if (json.settings) {
        settings = deepClone(json.settings);
      }
    }

    // If the user has used the app before, show/hide form sections
    if (getHasUsedAppBefore()) {
      const sections = Object.keys(settings.formToShow) as ShowForm[];
      const sectionVisibility: Record<ShowForm, boolean> = {
        workExperiences: resume.workExperiences.length > 0,
        educations: resume.educations.length > 0,
        projects: resume.projects.length > 0,
        skills: resume.skills.descriptions.length > 0,
        custom: resume.custom.descriptions.length > 0,
      };
      for (const section of sections) {
        settings.formToShow[section] = sectionVisibility[section];
      }
    }

    // Add logs to check imported data
    console.log('Importing resume:', resume);
    console.log('Importing settings:', settings);
    console.log('Section spacing:', settings.sectionSpacing);

    saveStateToLocalStorage({ resume, settings });
    router.push("/resume-builder");
  };

  return (
    <div
      className={cx(
        "flex justify-center rounded-md border-2 border-dashed px-6 bg-[#FAFDFC] shadow-sm transition-colors",
        isHoveredOnDropzone ? "border-[#2E4E43]" : "border-gray-300",
        playgroundView ? "pb-6 pt-4" : "py-12",
        className
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsHoveredOnDropzone(true);
      }}
      onDragLeave={() => setIsHoveredOnDropzone(false)}
      onDrop={onDrop}
    >
      <div className={cx("text-center", playgroundView ? "space-y-2" : "space-y-3")}>
        {!playgroundView && (
          <Image
            src={addPdfSrc}
            className="mx-auto h-14 w-14"
            alt="Add a PDF or JSON"
            aria-hidden="true"
            priority
          />
        )}

        {/* Display instructions or the file details */}
        {!hasFile ? (
          <>
            <p
              className={cx(
                "pt-3 text-[#2E4E43]",
                !playgroundView && "text-lg font-semibold"
              )}
            >
              {t("import.dropzone.browseOrDrop")}
            </p>
            <p className="flex items-center justify-center text-sm text-gray-500">
              <LockClosedIcon className="mr-1 h-4 w-4 text-gray-400" />
              {t("import.dropzone.localProcessing")}
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center gap-3 pt-3">
            <div className="pl-7 font-semibold text-[#2E4E43]">
              {file.name} &mdash; {getFileSizeString(file.size)}
            </div>
            <button
              type="button"
              className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500"
              title={t("import.dropzone.removeFile")}
              onClick={onRemove}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="pt-4">
          {!hasFile ? (
            <>
              <label
                className={cx(
                  "relative inline-block cursor-pointer rounded-full px-6 py-2 font-semibold text-white shadow-sm transition-colors",
                  // If not playground, use the theme color
                  !playgroundView ? "bg-[#2E4E43] hover:bg-[#276F5F]" : "border border-[#2E4E43] text-[#2E4E43]"
                )}
              >
                {t("import.dropzone.browseFile")}
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,.json"
                  onChange={onInputChange}
                />
              </label>
              {hasNonPdfFile && (
                <p className="mt-6 text-red-500">
                  {t("import.dropzone.unsupportedFile")}
                </p>
              )}
            </>
          ) : (
            <>
              {/* Only show import button if not in "playgroundView" mode */}
              {!playgroundView && (
                <button
                  type="button"
                  className="inline-block rounded-full bg-[#2E4E43] px-6 py-2 font-semibold text-white transition-colors hover:bg-[#276F5F]"
                  onClick={onImportClick}
                >
                  {t("import.dropzone.importAndContinue")} <span aria-hidden="true">→</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/** Utility to get file size string in KB or MB */
const getFileSizeString = (fileSizeB: number) => {
  const fileSizeKB = fileSizeB / 1024;
  const fileSizeMB = fileSizeKB / 1024;
  if (fileSizeKB < 1000) {
    return fileSizeKB.toPrecision(3) + " KB";
  } else {
    return fileSizeMB.toPrecision(3) + " MB";
  }
};
