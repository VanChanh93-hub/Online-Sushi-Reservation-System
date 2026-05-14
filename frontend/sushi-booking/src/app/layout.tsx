// src/app/layout.tsx
import "./globals.css";
import { Metadata } from "next";
import { locales, defaultLocale } from "../app/lib/i18n/config";

export const metadata: Metadata = {
  title: {
    template: "%s | Sushi Takumi",
    default: "Sushi Takumi", // Default title sẽ được ghi đè bởi layout con
  },
  description: "Website của Sushi Takumi - Nhà hàng Nhật Bản tại Việt Nam",
};

<<<<<<< HEAD
// src/app/layout.tsx
=======
>>>>>>> 0c9ba23994a8847a596f4fc74ddc6f328a5c606c
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout tổng không cần biết về ngôn ngữ
  return (
<<<<<<< HEAD
    <html lang="vi">
=======
    <html lang={defaultLocale}>
>>>>>>> 0c9ba23994a8847a596f4fc74ddc6f328a5c606c
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
<<<<<<< HEAD

=======
>>>>>>> 0c9ba23994a8847a596f4fc74ddc6f328a5c606c
