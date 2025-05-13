"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getHasUsedAppBefore } from "lib/redux/local-storage";
import { ResumeDropzone } from "components/ResumeDropzone";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../../utils/translations";
import { useAppDispatch } from "lib/redux/hooks";
import { setResume } from "lib/redux/resumeSlice";
import { setSettings } from "lib/redux/settingsSlice";
import { initialResumeState } from "lib/redux/resumeSlice";
import { initialSettings } from "lib/redux/settingsSlice";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { LanguageProvider } from "../../../contexts/LanguageContext";


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

    <Provider store={store}>
      <LanguageProvider>
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
      </LanguageProvider>
    </Provider>
  );
}

/** First-time user scenario */
function NewAppState({
  hasAddedResume,
  onFileUrlChange,
}: {
  hasAddedResume: boolean;
  onFileUrlChange: (fileUrl: string) => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleCreateNew = async() => {
    // Clear localStorage before creating a new resume
    console.log("Clearing localStorage");
    await localStorage.removeItem("nice-resume-state");
    
    // Reset Redux store to initial state
    dispatch(setResume(initialResumeState));
    dispatch(setSettings(initialSettings));

    router.push("/resume-builder");
  };
  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900">
        {t("import.title")}
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        {t("import.description")}
      </p>
      <ResumeDropzone onFileUrlChange={onFileUrlChange} className="mt-5" />

      <OrDivider />
      <SectionWithHeadingAndCreateButton
        heading={t("import.noResumeTitle")}
        buttonText={t("import.createNew")}
        subText={t("import.noResumeDescription")}
        handleClick={handleCreateNew}
      />
    </>
  );
}

/** Returning user scenario */
function UsedAppState({
  hasAddedResume,
  onFileUrlChange,
}: {
  hasAddedResume: boolean;
  onFileUrlChange: (fileUrl: string) => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleCreateNew = async() => {
    // Clear localStorage before creating a new resume
    console.log("Clearing localStorage");
    await localStorage.removeItem("nice-resume-state");
    
    // Reset Redux store to initial state
    dispatch(setResume(initialResumeState));
    dispatch(setSettings(initialSettings));

    router.push("/resume-builder");
  };

  const handleContinue = () => {
    router.push("/resume-builder");
  };
  
  return (
    <>
      {!hasAddedResume && (
        <>
          <SectionWithHeadingAndCreateButton
            heading={t("import.existingDataTitle")}
            buttonText={t("import.continueButton")}
            subText={t("import.existingDataDescription")}
            handleClick={handleContinue}
          />
          <OrDivider />
        </>
      )}
      <h1 className="text-lg font-semibold text-gray-900">
        {t("import.uploadNewTitle")}
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        {t("import.uploadNewDescription")}
      </p>
      <ResumeDropzone onFileUrlChange={onFileUrlChange} className="mt-5" />

      <OrDivider />
      <SectionWithHeadingAndCreateButton
        heading={t("import.startFreshTitle")}
        buttonText={t("import.createNewResume")}
        subText={t("import.startFreshDescription")}
        handleClick={handleCreateNew}
      />
    </>
  );
}

/** Divider component with "or" text */
const OrDivider = () => {
  const { t } = useTranslation();
  
  return (
    <div className="mt-8 mb-6 flex items-center" aria-hidden="true">
      <div className="flex-grow border-t border-gray-200" />
      <span className="mx-2 text-lg text-gray-400">{t("import.or")}</span>
      <div className="flex-grow border-t border-gray-200" />
    </div>
  );
};

/** Section component with heading and create button */
const SectionWithHeadingAndCreateButton = ({
  heading,
  subText,
  buttonText,
  handleClick,
}: {
  heading: string;
  subText?: string;
  buttonText: string;
  handleClick: () => void;
}) => {
 

  return (
    <div>
      <p className="text-base font-semibold text-gray-900">{heading}</p>
      {subText && <p className="mt-1 text-sm text-gray-600">{subText}</p>}
      <div className="mt-5">
        <button
          onClick={handleClick}
          className="rounded-full bg-sky-500 px-6 py-2 text-base font-semibold text-white shadow bg-[#2E4E43] hover:bg-[#276F5F] transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
