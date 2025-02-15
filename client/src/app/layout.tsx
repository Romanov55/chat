
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "../auth"
import axios from "axios";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Чат",
};

export default async function  RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
      
  if (session?.user) {
    try {
      const response = await axios.post("http://localhost:4000/api/user/registration", { 
        email: session.user.email, 
        name: session.user.name 
      });

      const userId = response.data?.data?._id;
      const cookieStore = await cookies()
      console.log(userId);

      if (userId) {
        cookieStore.set('name', 'lee')
      }
    } catch (error) {
      console.error("Ошибка регистрации:", error);
    } 
  }

  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
