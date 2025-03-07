import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import { Toaster } from "sonner";
import SessionProvider from "@/components/Provider/SessionProvider";
import ReactQueryProvider from "@/components/Provider/ReactQueryProvider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Science Times",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="kr">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <SessionProvider>
          <ReactQueryProvider>
            <Header />
              <div className="children">
                <Suspense>
                {children}
                </Suspense>
              </div>
            </ReactQueryProvider>
          </SessionProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
