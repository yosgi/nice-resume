import "globals.css";
import { TopNavBar } from "components/TopNavBar";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from '../../contexts/LanguageContext';

export const metadata = {
  title: "NiceResume - Nice Resume Builder",
  description:
    "free, open-source, and powerful resume builder,based on Open Resume",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <TopNavBar />
          {children}
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}
