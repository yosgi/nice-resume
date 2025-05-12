"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getHasUsedAppBefore } from "lib/redux/local-storage";
import { ResumeDropzone } from "components/ResumeDropzone";
import { useRouter } from "next/navigation";

export default function ImportResume() {
  const [hasUsedAppBefore, setHasUsedAppBefore] = useState(false);
  const [hasAddedResume, setHasAddedResume] = useState(false);

  useEffect(() => {
    setHasUsedAppBefore(getHasUsedAppBefore());
  }, []);

  const onFileUrlChange = (fileUrl: string) => {
    setHasAddedResume(Boolean(fileUrl));
  };

  return (
    <main className="mx-auto mt-14 max-w-3xl px-6 pb-10">
      <div className="rounded-md border border-gray-200 bg-white px-8 py-8 text-center shadow-md">
        {hasUsedAppBefore ? (
          <UsedAppState
            hasAddedResume={hasAddedResume}
            onFileUrlChange={onFileUrlChange}
          />
        ) : (
          <NewAppState
            hasAddedResume={hasAddedResume}
            onFileUrlChange={onFileUrlChange}
          />
        )}
      </div>
    </main>
  );
}

/** 用户第一次使用场景 */
function NewAppState({
  hasAddedResume,
  onFileUrlChange,
}: {
  hasAddedResume: boolean;
  onFileUrlChange: (fileUrl: string) => void;
}) {
  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900">
        Import data from an existing resume
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Easily parse your file and kickstart building your resume
      </p>
      <ResumeDropzone onFileUrlChange={onFileUrlChange} className="mt-5" />

      <OrDivider />
      <SectionWithHeadingAndCreateButton
        heading="Don't have a resume yet?"
        buttonText="Create New"
        subText="Start fresh and craft your own resume"
      />
    </>
  );
}

/** 用户已有本地数据场景 */
function UsedAppState({
  hasAddedResume,
  onFileUrlChange,
}: {
  hasAddedResume: boolean;
  onFileUrlChange: (fileUrl: string) => void;
}) {
  return (
    <>
      {!hasAddedResume && (
        <>
          <SectionWithHeadingAndCreateButton
            heading="We found existing data from a previous session"
            buttonText="Continue where I left off"
            subText="Pick up right where you stopped last time"
          />
          <OrDivider />
        </>
      )}
      <h1 className="text-lg font-semibold text-gray-900">
        Upload a new resume to replace current data
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        If you want to start fresh with a different file
      </p>
      <ResumeDropzone onFileUrlChange={onFileUrlChange} className="mt-5" />

      <OrDivider />
      <SectionWithHeadingAndCreateButton
        heading="Want to start completely fresh?"
        buttonText="Create New Resume"
        subText="Start with a blank slate and build your resume from scratch"
      />
    </>
  );
}

/** 分割组件 */
const OrDivider = () => (
  <div className="mt-8 mb-6 flex items-center" aria-hidden="true">
    <div className="flex-grow border-t border-gray-200" />
    <span className="mx-2 text-lg text-gray-400">or</span>
    <div className="flex-grow border-t border-gray-200" />
  </div>
);

/** 用于有标题与按钮的分块 */
const SectionWithHeadingAndCreateButton = ({
  heading,
  subText,
  buttonText,
}: {
  heading: string;
  subText?: string;
  buttonText: string;
}) => {
  const router = useRouter();

  const handleCreateNew = () => {
    // Clear localStorage before creating a new resume
    localStorage.removeItem("open-resume-state");
    router.push("/resume-builder");
  };

  return (
    <div>
      <p className="text-base font-semibold text-gray-900">{heading}</p>
      {subText && <p className="mt-1 text-sm text-gray-600">{subText}</p>}
      <div className="mt-5">
        <button
          onClick={handleCreateNew}
          className="rounded-full bg-sky-500 px-6 py-2 text-base font-semibold text-white shadow bg-[#2E4E43] hover:bg-[#276F5F] transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
