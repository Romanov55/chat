
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Чат",
};

export default async function  RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}
