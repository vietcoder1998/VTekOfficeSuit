import type { Metadata } from "next";
import "@/styles/theme.css";
import "@/styles/bases.css";
import "@/styles/layout.css";

export const metadata: Metadata = {
  title: "VTek Office Suite",
  description: "Unified VTek Office Suite Desktop Application & Distribution Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className="theme-surface theme-text antialiased">
        <div id="vtek-office-root-wrapper" className="div-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
