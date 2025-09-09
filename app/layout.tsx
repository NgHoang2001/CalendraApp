import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calendra app",
  description: "Ứng dụng Calendra là một ứng dụng lịch đơn giản và hiệu quả giúp bạn quản lý các sự kiện, cuộc họp và lịch trình của mình một cách dễ dàng. Được tổ chức và không bao giờ bỏ lỡ một ngày quan trọng nữa!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased animate-fade-in`}>
          <div>
            {children}

          </div>
          <Toaster className="z-10" />
        </body>
      </html>
    </ClerkProvider>
  );
}
