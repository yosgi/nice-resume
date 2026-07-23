"use client";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";
import { LanguageProvider } from "../../../contexts/LanguageContext";

export default function Create() {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <main className="relative h-full w-full overflow-hidden bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="col-span-1 lg:col-span-5">
              <ResumeForm />
            </div>
            <div className="col-span-1 min-w-0 lg:col-span-7">
              <Resume />
            </div>
          </div>
        </main>
      </LanguageProvider>
    </Provider>
  );
}
