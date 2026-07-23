"use client";
import { useMemo } from "react";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { ResumePDF } from "components/Resume/ResumePDF";
import {
  ResumeControlBarCSR,
  ResumeControlBarBorder,
} from "components/Resume/ResumeControlBar";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import {
  useRegisterReactPDFFont,
  useRegisterReactPDFHyphenationCallback,
} from "components/fonts/hooks";
import { NonEnglishFontsCSSLazyLoader } from "components/fonts/NonEnglishFontsCSSLoader";

export const Resume = () => {
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const document = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(settings.fontFamily);

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <div className="relative flex w-full justify-center">
        <div className="relative w-full min-w-0">
          <section className="h-[calc(100vh-var(--top-nav-bar-height)-var(--resume-control-bar-height))] w-full overflow-hidden p-2 md:p-[var(--resume-padding)]">
            <ResumeIframeCSR
              documentSize={settings.documentSize}
              scale={1}
              enablePDFViewer={true}
            >
              <ResumePDF resume={resume} settings={settings} isPDF={true} />
            </ResumeIframeCSR>
          </section>
          <ResumeControlBarCSR
            document={document}
            fileName={resume.profile.name + " - Resume"}
          />
        </div>
        <ResumeControlBarBorder />
      </div>
    </>
  );
};
