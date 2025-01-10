import Link from "next/link";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { AutoTypingResume } from "home/AutoTypingResume";

export const Hero = () => {
  return (
    <section className="lg:flex lg:h-[825px] lg:justify-center bg-gray-50">
      <FlexboxSpacer maxWidth={75} minWidth={0} className="hidden lg:block" />
      <div className="mx-auto max-w-xl pt-8 text-center lg:mx-0 lg:grow lg:pt-32 lg:text-left">
        <h1 className="pb-2 text-4xl font-bold text-[#2e4e43] lg:text-5xl">
          Create your professional resume easily
        </h1>
        <p className="mt-3 text-lg text-gray-700 lg:mt-5 lg:text-xl">
          With this free, open-source, and simple resume builder
        </p>
        <Link
          href="/resume-import"
          className="inline-block mt-6 lg:mt-14 rounded-md bg-[#2e4e43] px-6 py-3 text-white hover:bg-[#2e4e43]/90 transition-colors"
        >
          Get Started <span aria-hidden="true">→</span>
        </Link>
        {/* 
        <p className="mt-3 text-sm text-gray-600 lg:mt-36">
          Already have a resume? Test its ATS readability with the{" "}
          <Link href="/resume-parser" className="underline underline-offset-2">
            resume parser
          </Link>
        </p>
        */}
      </div>
      <FlexboxSpacer maxWidth={100} minWidth={50} className="hidden lg:block" />
      <div className="mt-6 flex justify-center lg:mt-4 lg:block lg:grow">
        <AutoTypingResume />
      </div>
    </section>
  );
};
