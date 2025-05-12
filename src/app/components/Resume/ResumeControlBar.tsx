"use client";
import { useEffect } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ArrowUpIcon
} from "@heroicons/react/24/outline";
import {
  exportStateFromLocalStorage
} from "lib/redux/local-storage";
import { usePDF, PDFViewer } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import JSZip from "jszip";

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const [instance, update] = usePDF({ document });

  // Hook to update pdf when document changes
  useEffect(() => {
    update(document);
  }, [update, document]);

  const handleDownload = async () => {
    await update(document);
    if (instance.url) {
      const a = window.document.createElement('a');
      a.href = instance.url;
      a.download = `${fileName}.pdf`;
      a.click();
    }
  };

  const handleDownloadAll = async () => {
    try {
      // Create a new zip file
      const zip = new JSZip();
      
      // Add PDF to zip
      await update(document);
      if (!instance.url) {
        throw new Error('Failed to generate PDF');
      }
      const pdfResponse = await fetch(instance.url);
      if (!pdfResponse.ok) {
        throw new Error('Failed to fetch PDF');
      }
      const pdfBlob = await pdfResponse.blob();
      zip.file(`${fileName}.pdf`, pdfBlob);
      
      // Add JSON data to zip
      const jsonData = exportStateFromLocalStorage();
      zip.file(`${fileName}.json`, JSON.stringify(jsonData, null, 2));
      
      // Generate and download zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = window.document.createElement('a');
      a.href = zipUrl;
      a.download = `${fileName}.zip`;
      a.click();
      URL.revokeObjectURL(zipUrl);
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Failed to create zip file. Please try again.');
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-center px-[var(--resume-padding)] text-gray-600 lg:justify-between">
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
        />
        <div className="w-10">{`${Math.round(scale * 100)}%`}</div>
        <label className="hidden items-center gap-1 lg:flex">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4"
            checked={scaleOnResize}
            onChange={() => setScaleOnResize((prev) => !prev)}
          />
          <span className="select-none">Autoscale</span>
        </label>
      </div>
      
      <div className="flex gap-2">
        <a
          className="ml-1 flex items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 hover:bg-gray-100 lg:ml-8 cursor-pointer"
          onClick={handleDownloadAll}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">Download Files</span>
        </a>
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
