import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import SessionWrapper from "@/lib/SessionWrapper";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SiteHeader } from "@/components/navbar/header";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Move37",
  description:
    "Create Videos Instantly with AI. Edit AI-generated videos with ease.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Move37",
    description:
      "Create Videos Instantly with AI. Edit AI-generated videos with ease.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SessionWrapper>
        <html lang="en" suppressHydrationWarning={true}>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            suppressHydrationWarning={true}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ReduxProvider>
                <ToastProvider>
                  <SiteHeader />
                  {children}
                </ToastProvider>
              </ReduxProvider>
            </ThemeProvider>
          </body>
        </html>
      </SessionWrapper>
    </>
  );
}
