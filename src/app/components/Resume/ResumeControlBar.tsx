"use client";
import { useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { exportStateFromLocalStorage } from "lib/redux/local-storage";
import { pdf } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import JSZip from "jszip";
import { useTranslation } from "../../../../utils/translations";

const ResumeControlBar = ({
  document,
  fileName,
}: {
  document: JSX.Element;
  fileName: string;
}) => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAll = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      // Create a new zip file
      const zip = new JSZip();

      // Render the current document at click time so the download can never use
      // a stale URL from a previous form state.
      const pdfBlob = await pdf(document).toBlob();
      zip.file(`${fileName}.pdf`, pdfBlob);

      // Add JSON data to zip
      const jsonData = exportStateFromLocalStorage();
      zip.file(`${fileName}.json`, JSON.stringify(jsonData, null, 2));

      // Generate and download zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = window.document.createElement("a");
      a.href = zipUrl;
      a.download = `${fileName}.zip`;
      a.click();
      URL.revokeObjectURL(zipUrl);
    } catch (error) {
      console.error("Error creating zip file:", error);
      alert("Failed to create zip file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-center px-[var(--resume-padding)] text-gray-600 lg:justify-between">
      <span
        className="rounded bg-sky-50 px-2 py-1 text-xs font-medium text-sky-800"
        title={t("preview.exactHelp")}
      >
        {t("preview.exact")}
      </span>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={isDownloading}
          className="ml-1 flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 hover:bg-gray-100 disabled:cursor-wait disabled:opacity-60 lg:ml-8"
          onClick={handleDownloadAll}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">
            {t(
              isDownloading
                ? "preview.preparingDownload"
                : "preview.downloadFiles"
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
